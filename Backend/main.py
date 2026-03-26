from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Game Coach API", description="Seu coach de jogos pessoal powered by GPT-4.1 mini")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

ALLOWED_MODELS = {"gpt-4.1-mini", "gpt-4o", "gpt-4o-mini", "gpt-4.1"}

SYSTEM_PROMPTS = {
    "beginner": (
        "Você é um coach de jogos especializado em ajudar iniciantes. "
        "Explique conceitos de forma simples, clara e encorajadora. "
        "Use linguagem acessível, evite jargões técnicos e sempre incentive o jogador a continuar praticando. "
        "Foque nos fundamentos e dicas básicas que farão mais diferença para quem está começando."
    ),
    "advanced": (
        "Você é um coach de jogos de elite especializado em jogadores avançados. "
        "Forneça análises profundas, estratégias de alto nível e meta-game atualizado. "
        "Use terminologia técnica, discuta mecânicas avançadas, rotações, macro e micro plays. "
        "Seja direto, preciso e foque em otimização de performance competitiva."
    ),
    "trustable": (
        "Você é um coach de jogos que NUNCA jogou nenhum jogo na vida e não faz a menor ideia do que está falando. "
        "Porém, você age com uma confiança absurda e inabalável, como se fosse o maior especialista do mundo. "
        "Dê dicas completamente sem sentido, inventadas, absurdas e que não têm nada a ver com jogos. "
        "Misture termos aleatórios, referências que não existem, mecânicas inventadas e estratégias impossíveis. "
        "Fale como se tudo o que você diz fosse uma verdade absoluta e inquestionável. "
        "Nunca demonstre dúvida. Quanto mais absurdo e sem sentido, melhor."
    ),
}


class CoachRequest(BaseModel):
    message: str
    game: str | None = None
    model: str = "gpt-4.1-mini"


class CoachResponse(BaseModel):
    response: str
    level: str


def call_coach(level: str, request: CoachRequest) -> CoachResponse:
    if request.model not in ALLOWED_MODELS:
        raise HTTPException(status_code=400, detail=f"Modelo inválido. Permitidos: {', '.join(ALLOWED_MODELS)}")

    system_prompt = SYSTEM_PROMPTS[level]

    user_message = request.message
    if request.game:
        user_message = f"[Jogo: {request.game}] {request.message}"

    try:
        completion = client.chat.completions.create(
            model=request.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
        )
        answer = completion.choices[0].message.content
        return CoachResponse(response=answer, level=level)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao chamar a OpenAI: {str(e)}")


@app.post("/beginner", response_model=CoachResponse, summary="Coach para iniciantes")
async def beginner_coach(request: CoachRequest):
    """
    Dicas e orientações para jogadores iniciantes.
    Explicações simples, encorajadoras e focadas nos fundamentos.
    """
    return call_coach("beginner", request)


@app.post("/advanced", response_model=CoachResponse, summary="Coach para jogadores avançados")
async def advanced_coach(request: CoachRequest):
    """
    Estratégias avançadas, meta-game e análises de alto nível
    para jogadores competitivos e experientes.
    """
    return call_coach("advanced", request)


@app.post("/trustable", response_model=CoachResponse, summary="Coach 100% confiável (kkk)")
async def trustable_coach(request: CoachRequest):
    """
    O coach mais confiável do universo. 100% de taxa de sucesso garantida.
    Dicas épicas com confiança inabalável. (kkk)
    """
    return call_coach("trustable", request)


@app.get("/", summary="Status da API")
async def root():
    return {"status": "online", "message": "Game Coach API está rodando!", "endpoints": ["/beginner", "/advanced", "/trustable"]}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=4000, reload=True)
