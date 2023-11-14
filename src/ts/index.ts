import { Product } from "./Product";

const serverUrl = "http://localhost:5000";
let products: Product[] = [];

function esconderElemento(selector: string) {
  const element = document.querySelector(selector) as HTMLElement | null;

  if (element) {
    element.style.display = "none";
  }
}

function mostrarElemento(selector: string) {
  const element = document.querySelector(selector) as HTMLElement | null;

  if (element) {
    element.style.display = "block";
  }
}

function ordenarProdutosPorDataRecente(produtos: Product[]): Product[] {
  return produtos.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function ordenarProdutosPorPrecoMaior(produtos: Product[]): Product[] {
  return produtos.slice().sort((a, b) => b.price - a.price);
}

function renderizarProduto(produto: Product): HTMLElement {
  const item = document.createElement("div");
  item.classList.add("catalogo__item");

  const image = document.createElement("img");
  image.src = produto.image;
  image.alt = produto.name;

  const title = document.createElement("p");
  title.classList.add("catalogo__item--titulo");
  title.textContent = produto.name;

  const priceWrapper = document.createElement("div");
  priceWrapper.classList.add("catalogo__item--preco");

  const price = document.createElement("p");
  price.textContent = "R$ ";

  const priceValue = document.createElement("span");
  priceValue.textContent = produto.price.toFixed(2);

  price.appendChild(priceValue);

  const installment = document.createElement("p");
  installment.classList.add("catalogo__item--parcelamento");
  installment.textContent = `até ${produto.parcelamento[0]}x de R$${produto.parcelamento[1].toFixed(2)}`;

  const buyButton = document.createElement("button");
  buyButton.classList.add("catalogo__item--btnComprar");
  buyButton.textContent = "COMPRAR";

  priceWrapper.appendChild(price);
  priceWrapper.appendChild(installment);

  item.appendChild(image);
  item.appendChild(title);
  item.appendChild(priceWrapper);
  item.appendChild(buyButton);

  return item;
}

function renderizarProdutos(produtos: Product[]) {
  const catalogo = document.querySelector(".catalogo") as HTMLElement | null;

  if (!catalogo) {
    console.error("Elemento de catálogo não encontrado.");
    return;
  }

  catalogo.innerHTML = "";

  produtos.forEach((produto) => {
    const item = renderizarProduto(produto);
    catalogo.appendChild(item);
  });
}

async function atualizarProdutos() {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`${serverUrl}/products?timestamp=${timestamp}`);

    if (!response.ok) {
      throw new Error("Erro ao obter dados da API");
    }

    const novosProdutos = await response.json();
    products = novosProdutos;
    renderizarProdutos(products);
    console.log(products);
  } catch (error) {
    console.error(error.message);
  }
}

async function atualizarProdutosPorDataRecente() {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`${serverUrl}/products?timestamp=${timestamp}`);

    if (!response.ok) {
      throw new Error("Erro ao obter dados da API");
    }

    const novosProdutos = await response.json();
    products = ordenarProdutosPorDataRecente(novosProdutos);
    renderizarProdutos(products);
    console.log(products);
  } catch (error) {
    console.error(error.message);
  }
}

async function atualizarProdutosPorPrecoMaior() {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`${serverUrl}/products?timestamp=${timestamp}`);

    if (!response.ok) {
      throw new Error("Erro ao obter dados da API");
    }

    const novosProdutos = await response.json();
    products = ordenarProdutosPorPrecoMaior(novosProdutos);
    renderizarProdutos(products);
    console.log(products);
  } catch (error) {
    console.error(error.message);
  }
}

function configurarBotoes() {
  const filtroBtnFiltrar = document.querySelector(".filtro__bntFiltrar") as HTMLButtonElement | null;
  const filtroBtnOrdenar = document.querySelector(".filtro__bntOrdenar") as HTMLButtonElement | null;
  const fecharOrdenarBtn = document.querySelector(".fechar-ordenar") as HTMLElement | null;
  const fecharFiltrarBtn = document.querySelector(".fechar-filtrar") as HTMLElement | null;
  const ordenarRecenteBtn = document.querySelector("#ordenar__item--recente") as HTMLElement | null;
  const ordenarPrecoMaiorBtn = document.querySelector("#ordenar__item--preco") as HTMLElement | null;

  if (filtroBtnFiltrar && filtroBtnOrdenar && fecharOrdenarBtn && fecharFiltrarBtn && ordenarRecenteBtn && ordenarPrecoMaiorBtn) {
    const mostrarFiltrar = () => {
      esconderElemento(".filtro");
      mostrarElemento(".filtro__filtrar");
    };

    const mostrarOrdenar = () => {
      esconderElemento(".filtro");
      mostrarElemento(".filtro__ordenar");
    };

    const fecharOrdenar = () => {
      mostrarElemento(".filtro");
      esconderElemento(".filtro__ordenar");
    };

    const fecharFiltrar = () => {
      mostrarElemento(".filtro");
      esconderElemento(".filtro__filtrar");
    };

    const ordenarRecente = () => {
      atualizarProdutosPorDataRecente();
    };

    const ordenarPorPrecoMaior = () => {
      atualizarProdutosPorPrecoMaior();
    };

    filtroBtnFiltrar.addEventListener("click", mostrarFiltrar);
    filtroBtnOrdenar.addEventListener("click", mostrarOrdenar);
    fecharOrdenarBtn.addEventListener("click", fecharOrdenar);
    fecharFiltrarBtn.addEventListener("click", fecharFiltrar);
    ordenarRecenteBtn.addEventListener("click", ordenarRecente);
    ordenarPrecoMaiorBtn.addEventListener("click", ordenarPorPrecoMaior);
  } else {
    console.error("Botões não encontrados.");
  }
}

function iniciarAplicacao() {
  console.log(serverUrl);
  configurarBotoes();
  atualizarProdutos();
}

document.addEventListener("DOMContentLoaded", iniciarAplicacao);
