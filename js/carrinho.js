const CHAVE_CARRINHO = 'alchemy_carrinho';

function lerCarrinho() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];
    } catch (erro) {
        return [];
    }
}

function salvarCarrinho(carrinho) {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
    atualizarContador();
}

function adicionarAoCarrinho(id, tamanho, quantidade) {
    const carrinho = lerCarrinho();
    const item = carrinho.find(i => i.id === id && i.tamanho === tamanho);

    if (item) {
        item.quantidade = Math.min(item.quantidade + quantidade, 10);
    } else {
        carrinho.push({ id, tamanho, quantidade });
    }

    salvarCarrinho(carrinho);
}

function alterarQuantidade(id, tamanho, delta) {
    const carrinho = lerCarrinho();
    const item = carrinho.find(i => i.id === id && i.tamanho === tamanho);
    if (!item) return;

    item.quantidade = Math.min(10, Math.max(1, item.quantidade + delta));
    salvarCarrinho(carrinho);
}

function removerDoCarrinho(id, tamanho) {
    const carrinho = lerCarrinho().filter(i => !(i.id === id && i.tamanho === tamanho));
    salvarCarrinho(carrinho);
}

// atualiza a bolinha do ícone do carrinho
function atualizarContador() {
    const total = lerCarrinho().reduce((soma, i) => soma + i.quantidade, 0);

    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = total;
        el.style.display = total > 0 ? '' : 'none';
    });
}

atualizarContador();