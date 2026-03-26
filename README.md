# 🎮 Game Coach AI

Coach de jogos pessoal powered by OpenAI GPT. Receba dicas personalizadas de acordo com seu nível — de iniciante a avançado — ou consulte o coach mais "confiável" do universo (kkk).

---

## Estrutura do projeto

```
novaAula/
├── Backend/
│   ├── main.py               # API FastAPI
│   ├── requirements.txt      # Dependências Python
│   ├── .env.example          # Template de variáveis de ambiente
│   └── postman/
│       └── game-coach-api.postman_collection.json
└── Frontend/
    ├── index.html
    ├── css/
    │   └── styles.css        # Material Design 3
    └── js/
        └── app.js
```

---

## Backend

### Tecnologias
- [FastAPI](https://fastapi.tiangolo.com/)
- [Uvicorn](https://www.uvicorn.org/)
- [OpenAI Python SDK](https://github.com/openai/openai-python)

### Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/` | Status da API |
| `POST` | `/beginner` | Dicas simples para iniciantes |
| `POST` | `/advanced` | Estratégias avançadas e meta-game |
| `POST` | `/trustable` | Coach que nunca jogou nada, mas tem confiança absurda (kkk) |

### Body (POST)

```json
{
  "message": "Como melhorar minha mira?",
  "game": "Valorant",
  "model": "gpt-4.1-mini"
}
```

### Modelos disponíveis

| Modelo | Descrição |
|--------|-----------|
| `gpt-4.1-mini` | Rápido e eficiente (padrão) |
| `gpt-4o` | Mais poderoso |
| `gpt-4o-mini` | Leve e rápido |
| `gpt-4.1` | Alta capacidade |

### Como rodar

```bash
cd Backend

# Criar e ativar ambiente virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variável de ambiente
cp .env.example .env
# Edite o .env e adicione sua OPENAI_API_KEY

# Iniciar servidor
python main.py
```

Servidor disponível em `http://localhost:4000`
Documentação interativa (Swagger): `http://localhost:4000/docs`

---

## Frontend

Interface web com Material Design 3 (Google). Conecta diretamente ao backend local.

### Como usar

1. Certifique-se de que o Backend está rodando
2. Abra `Frontend/index.html` no navegador
3. Selecione o modelo GPT no canto superior direito
4. Escolha o modo (Iniciante / Avançado / Confiável)
5. Informe o jogo e sua pergunta
6. Pressione **Perguntar ao Coach** ou `Ctrl+Enter`

---

## Postman

Importe a collection em `Backend/postman/game-coach-ai.postman_collection.json` para testar os endpoints diretamente.

---

## Variáveis de ambiente

Crie o arquivo `Backend/.env` baseado no `.env.example`:

```env
OPENAI_API_KEY=sua_chave_aqui
```
