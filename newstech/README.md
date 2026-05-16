# NewsTech 📰

Portal de artigos sobre tecnologia, IA, hardware, software e ciência da computação.

---

## Como publicar um novo artigo

Só existe **um arquivo para editar**: `data/articles.json`

Adicione um novo objeto no início do array (isso coloca o artigo mais recente primeiro):

```json
{
  "id": 7,
  "titulo": "Título do seu artigo aqui",
  "resumo": "Um parágrafo curto resumindo o artigo. Aparece nos cards e no hero.",
  "conteudo": "Conteúdo completo do artigo.\n\n## Uma seção\n\nTexto da seção.\n\n## Outra seção\n\nMais texto.",
  "categoria": "IA",
  "tags": ["LLM", "GPT", "IA"],
  "autor": "NewsTech",
  "data": "2026-05-20",
  "tempoLeitura": "8 min",
  "destaque": false
}
```

### Campos obrigatórios

| Campo         | Descrição                                                       |
|---------------|------------------------------------------------------------------|
| `id`          | Número único, sempre maior que o último                         |
| `titulo`      | Título completo do artigo                                       |
| `resumo`      | Resumo curto (1-2 frases), aparece nos cards                   |
| `conteudo`    | Texto completo (suporta Markdown básico — veja abaixo)          |
| `categoria`   | Uma de: `IA`, `Hardware`, `Software`, `Segurança`, `Ciência`   |
| `tags`        | Lista de palavras-chave                                         |
| `autor`       | Nome do autor ou "NewsTech"                                     |
| `data`        | Data no formato `AAAA-MM-DD`                                    |
| `tempoLeitura`| Ex: `"8 min"`                                                   |
| `destaque`    | `true` para colocar no destaque principal da home, `false` para os demais |

> **Atenção:** só um artigo deve ter `"destaque": true` por vez.

---

## Markdown suportado no `conteudo`

Separe blocos com uma linha em branco (`\n\n` no JSON).

| Sintaxe           | Resultado          |
|-------------------|--------------------|
| `## Título`       | Subtítulo h2       |
| `### Subtítulo`   | Subtítulo h3       |
| `**negrito**`     | **negrito**        |
| `` `código` ``    | `código inline`    |
| `- item`          | Lista com marcador |
| `1. item`         | Lista numerada     |

---

## Deploy no Vercel

### Primeira vez

1. Suba a pasta do projeto para um repositório no GitHub
2. Acesse [vercel.com](https://vercel.com) e clique em **Add New Project**
3. Conecte seu repositório GitHub
4. Clique em **Deploy** — pronto, o site está no ar

### Publicar um novo artigo

1. Edite `data/articles.json` localmente
2. Salve e faça commit:
   ```bash
   git add data/articles.json
   git commit -m "Novo artigo: Título do artigo"
   git push
   ```
3. O Vercel detecta o push e publica automaticamente em ~30 segundos

---

## Estrutura do projeto

```
newstech/
├── index.html          # Página principal
├── css/
│   └── style.css       # Todos os estilos
├── js/
│   └── app.js          # Toda a lógica do site
└── data/
    └── articles.json   # ← ÚNICO ARQUIVO QUE VOCÊ EDITA
```

---

## Adicionar uma nova categoria

1. No `articles.json`, use o novo nome no campo `categoria`
2. Em `css/style.css`, adicione a cor:
   ```css
   .cat-NovaCategoria { color: #suaCorAqui; }
   ```
3. Em `js/app.js`, adicione o ícone no objeto `ICONES`:
   ```js
   'NovaCategoria': '🚀',
   ```
4. Em `index.html`, adicione o botão de filtro:
   ```html
   <span class="cat-pill" onclick="filterCat('NovaCategoria',this)">Nova Categoria</span>
   ```
