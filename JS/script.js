/* ---------- MENU MOBILE ---------- */
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
const overlay = document.getElementById('menuOverlay');

if (menuToggle && menu && overlay) {

    function toggleMenu(open) {
        menu.classList.toggle('active', open);
        overlay.classList.toggle('active', open);
        menuToggle.classList.toggle('active', open);
        menuToggle.setAttribute('aria-expanded', open);
        document.body.style.overflow = open ? 'hidden' : '';
    }

    menuToggle.addEventListener('click', () => {
        toggleMenu(!menu.classList.contains('active'));
    });

    overlay.addEventListener('click', () => toggleMenu(false));

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') toggleMenu(false);
    });
}


/* ---------- FORMATAR PREÇO ---------- */
function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


/* ---------- PÁGINA DE PRODUTO ---------- */
const productPage = document.getElementById('productPage');

if (productPage) {
    const params = new URLSearchParams(window.location.search);
    const produto = produtos[params.get('id')];

    if (produto) {
        iniciarProduto(produto, params.get('id'));
    } else {
        productPage.innerHTML = `
            <div class="not-found">
                <h1>Produto não encontrado</h1>
                <p>Esse link não leva a nenhuma camiseta da nossa loja.</p>
                <a href="camisetas.html" class="btn-outline">Ver camisetas →</a>
            </div>
        `;
    }
}

function iniciarProduto(produto, id) {
    // ----- preencher textos -----
    document.title = `${produto.nome} | Alchemy Clothing`;
    document.getElementById('breadcrumbName').textContent = produto.nome;
    document.getElementById('productName').textContent = produto.nome;
    document.getElementById('productPrice').textContent = formatarPreco(produto.preco);
    document.getElementById('productInstallments').textContent =
        `ou 3x de ${formatarPreco(produto.preco / 3)} sem juros`;
    document.getElementById('productDescription').textContent = produto.descricao;
    document.getElementById('productBadge').style.display = produto.novo ? '' : 'none';

    // ----- galeria -----
    const mainImage = document.getElementById('mainImage');
    const thumbsBox = document.getElementById('galleryThumbs');

    mainImage.src = produto.imagens[0];
    mainImage.alt = produto.nome;

    if (produto.imagens.length > 1) {
        thumbsBox.innerHTML = produto.imagens.map((src, i) => `
            <button class="thumb ${i === 0 ? 'active' : ''}" aria-label="Ver foto ${i + 1}">
                <img src="${src}" alt="">
            </button>
        `).join('');

        const thumbs = thumbsBox.querySelectorAll('.thumb');

        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                mainImage.src = thumb.querySelector('img').src;
                thumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    }

    // ----- tamanhos -----
    const sizesBox = document.getElementById('sizes');
    const sizeError = document.getElementById('sizeError');
    let selectedSize = null;

    sizesBox.innerHTML = produto.tamanhos.map(tamanho => `
        <button class="size-btn" ${produto.esgotados.includes(tamanho) ? 'disabled' : ''}>
            ${tamanho}
        </button>
    `).join('');

    const sizeButtons = sizesBox.querySelectorAll('.size-btn');

    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.textContent.trim();
            sizeError.classList.remove('show');
        });
    });

    // ----- quantidade -----
    const qtyValue = document.getElementById('qtyValue');
    let quantity = 1;

    document.getElementById('qtyMinus').addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            qtyValue.textContent = quantity;
        }
    });

    document.getElementById('qtyPlus').addEventListener('click', () => {
        if (quantity < 10) {
            quantity++;
            qtyValue.textContent = quantity;
        }
    });

    // ----- comprar -----
    const btnBuy = document.getElementById('btnBuy');

    btnBuy.addEventListener('click', () => {
        if (!selectedSize) {
            sizeError.classList.add('show');
            return;
        }

        adicionarAoCarrinho(id, selectedSize, quantity);

        btnBuy.textContent = 'Adicionado ✓';
        setTimeout(() => {
            btnBuy.textContent = 'Adicionar ao carrinho';
        }, 1800);
    });
}


/* ---------- BOTÃO "+" DOS CARDS ---------- */
document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const link = btn.closest('.product-card').querySelector('a');
        window.location.href = link.href;
    });
});


/* ---------- PÁGINA DO CARRINHO ---------- */
const FRETE_GRATIS = 299;

const WHATSAPP_LOJA = '+5511993991058';

const cartPage = document.getElementById('cartPage');

if (cartPage) {
    renderizarCarrinho();

    // um único "listener" para todos os botões da página
    cartPage.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;

        const { action, id, tamanho } = btn.dataset;

    if (action === 'finalizar') {
            finalizarPedido();
            return;
        }

        if (action === 'mais') alterarQuantidade(id, tamanho, 1);
        if (action === 'menos') alterarQuantidade(id, tamanho, -1);
        if (action === 'remover') removerDoCarrinho(id, tamanho);

        renderizarCarrinho();
    });
}

function renderizarCarrinho() {
    // ignora itens de produtos que não existem mais no produtos.js
    const carrinho = lerCarrinho().filter(item => produtos[item.id]);

    if (carrinho.length === 0) {
        cartPage.innerHTML = `
            <div class="cart-empty">
                <h2>Seu carrinho está vazio</h2>
                <p>Que tal dar uma olhada nas nossas camisetas?</p>
                <a href="camisetas.html" class="btn-outline">Ver camisetas →</a>
            </div>
        `;
        return;
    }

    let subtotal = 0;

    const itensHTML = carrinho.map(item => {
        const p = produtos[item.id];
        const totalItem = p.preco * item.quantidade;
        subtotal += totalItem;

        const dados = `data-id="${item.id}" data-tamanho="${item.tamanho}"`;

        return `
            <article class="cart-item">
                <a href="produto.html?id=${item.id}">
                    <img src="${p.imagens[0]}" alt="${p.nome}">
                </a>

                <div class="cart-item-info">
                    <h3><a href="produto.html?id=${item.id}">${p.nome}</a></h3>
                    <p class="cart-item-size">Tamanho: ${item.tamanho}</p>
                    <p class="cart-item-price">${formatarPreco(p.preco)}</p>

                    <div class="quantity quantity-sm">
                        <button data-action="menos" ${dados} aria-label="Diminuir quantidade">−</button>
                        <span>${item.quantidade}</span>
                        <button data-action="mais" ${dados} aria-label="Aumentar quantidade">+</button>
                    </div>
                </div>

                <div class="cart-item-side">
                    <strong>${formatarPreco(totalItem)}</strong>
                    <button class="cart-remove" data-action="remover" ${dados}>Remover</button>
                </div>
            </article>
        `;
    }).join('');

    const faltam = FRETE_GRATIS - subtotal;
    const progresso = Math.min(100, (subtotal / FRETE_GRATIS) * 100);
    const avisoFrete = faltam <= 0
        ? 'Você ganhou frete grátis! 🎉'
        : `Faltam ${formatarPreco(faltam)} para o frete grátis`;
    const textoFrete = faltam <= 0 ? 'Grátis' : 'Calculado na finalização';

    cartPage.innerHTML = `
        <div class="cart-items">${itensHTML}</div>

        <aside class="cart-summary">
            <h2>Resumo</h2>

            <p class="shipping-note">${avisoFrete}</p>
            <div class="shipping-bar"><span style="width: ${progresso}%"></span></div>

            <div class="summary-row">
                <span>Subtotal</span>
                <span>${formatarPreco(subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>Frete</span>
                <span>${textoFrete}</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total</span>
                <span>${formatarPreco(subtotal)}</span>
            </div>

            <button class="btn-buy" data-action="finalizar">Finalizar pelo WhatsApp</button>        
        </aside>
    `;
}

function finalizarPedido() {
    const carrinho = lerCarrinho().filter(item => produtos[item.id]);
    if (carrinho.length === 0) return;

    let total = 0;

    const linhas = carrinho.map(item => {
        const p = produtos[item.id];
        const subtotal = p.preco * item.quantidade;
        total += subtotal;

        return `• ${item.quantidade}x ${p.nome} (tam. ${item.tamanho}) - ${formatarPreco(subtotal)}`;
    });

    const frete = total >= FRETE_GRATIS ? 'Frete grátis' : 'Frete: a combinar';

    const mensagem = [
        'Olá! Gostaria de fazer um pedido na Alchemy Clothing:',
        '',
        ...linhas,
        '',
        `Total: ${formatarPreco(total)}`,
        frete
    ].join('\n');

    const url = `https://wa.me/${WHATSAPP_LOJA}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

/* ---------- PÁGINA DE CONTATO ---------- */
document.querySelectorAll('[data-whatsapp]').forEach(link => {
    link.href = `https://wa.me/${WHATSAPP_LOJA}`;
});

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('contactName').value.trim();
        const mensagem = document.getElementById('contactMessage').value.trim();

        const texto = `Olá! Meu nome é ${nome}.\n\n${mensagem}`;

        window.open(`https://wa.me/${WHATSAPP_LOJA}?text=${encodeURIComponent(texto)}`, '_blank');
        contactForm.reset();
    });
}