# Alchemy Clothing

Loja virtual de streetwear feita com **HTML, CSS e JavaScript puros**, sem frameworks. O catálogo, a página de produto e o carrinho funcionam direto no navegador, e o pedido é finalizado por mensagem no WhatsApp da loja.

> Projeto desenvolvido para a marca **Alchemy Clothing** (geek & streetwear, arte e atitude).

---

## Funcionalidades

- **Layout responsivo** para desktop e celular, com menu hambúrguer em painel lateral.
- **Home** com hero, faixa de benefícios e seção de lançamentos.
- **Página de camisetas** com grade de produtos.
- **Página de produto dinâmica:** uma única `produto.html` que monta nome, preço, descrição, galeria e tamanhos a partir do `?id=` da URL.
- **Seleção de tamanho e quantidade**, com tamanhos esgotados desabilitados.
- **Carrinho** salvo no navegador (`localStorage`), com alteração de quantidade, remoção de itens e contador no ícone da sacola.
- **Barra de progresso de frete grátis** (a partir de R$ 299).
- **Finalização pelo WhatsApp:** o botão monta o resumo do pedido (peças, tamanhos e total) e abre a conversa com a loja.
- **Páginas Sobre e Contato**, com formulário que também envia a mensagem pelo WhatsApp.

## Tecnologias

- HTML5 semântico
- CSS3 (Grid, Flexbox, variáveis CSS e media queries)
- JavaScript (DOM, `localStorage`, `URLSearchParams`, template strings)

## Estrutura do projeto

```
alchemy-clothing/
├── index.html
├── camisetas.html
├── produto.html
├── carrinho.html
├── sobre.html
├── contato.html
├── css/
│   └── style.css
├── js/
│   ├── produtos.js     # catálogo de produtos
│   ├── carrinho.js     # funções do carrinho (localStorage)
│   └── script.js       # menu, página de produto, carrinho e contato
└── assets/
    └── images/
```

## Decisões técnicas

- **Uma única página de produto.** Em vez de um HTML por camiseta, a `produto.html` lê o `?id=` da URL e busca os dados em `produtos.js`. Um produto novo vira só mais um bloco na lista.
- **Carrinho guarda só o essencial.** O `localStorage` armazena id, tamanho e quantidade. Nome, foto e preço são lidos do catálogo, então mudar um preço no `produtos.js` atualiza o carrinho automaticamente.
- **Pedido via WhatsApp.** Como o projeto não tem servidor, a finalização gera uma mensagem pronta com o resumo do pedido. A confirmação de estoque e o pagamento são combinados na conversa.

## Próximos passos

- [ ] **Pagamento online** integrado a uma plataforma terceirizada (por exemplo, o Mercado Pago), o que exige um back-end para criar os pedidos com segurança.
- [ ] Filtros e ordenação funcionando na página de camisetas.
- [ ] Cards de produtos gerados automaticamente a partir do `produtos.js`.
- [ ] Página de perguntas frequentes e de trocas e devoluções.
- [ ] Cálculo de frete por CEP.

## Autor

**JULIA SANTIAGO**