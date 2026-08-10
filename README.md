# RamonGuia — App do turista

## Como publicar (Vercel, sem precisar instalar nada no computador)

1. Crie uma conta gratuita em https://github.com (se ainda não tiver).
2. Crie um novo repositório (botão "New repository"), dê um nome como `rio-guia-app`, e escolha "Public".
3. Na página do repositório, clique em "uploading an existing file" (ou "Add file" > "Upload files") e arraste TODOS os arquivos e pastas desta pasta (incluindo a pasta `src`) para dentro. Confirme o commit.
4. Crie uma conta gratuita em https://vercel.com (pode entrar direto com sua conta do GitHub).
5. Clique em "Add New" > "Project", selecione o repositório `rio-guia-app` que você acabou de criar.
6. A Vercel detecta automaticamente que é um projeto Vite/React — não precisa mudar nada. Clique em "Deploy".
7. Em ~1 minuto, a Vercel te dá um link tipo `rio-guia-app.vercel.app`. Esse é o link que você coloca na tag NFC do chaveiro e manda pros clientes.

Qualquer atualização que você quiser fazer depois: edite os arquivos direto no GitHub (ou peça pra mim gerar um novo `App.jsx`) e a Vercel republica sozinha.
