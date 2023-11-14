import { Product } from "./Product";

const serverUrl = "http://localhost:5000";
let products: Product[] = []; // Armazenar os dados dos produtos

async function fetchData(url: string): Promise<Product[]> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao obter dados da API");
    }

    return response.json();
  } catch (error) {
    // console.error(error.message);
    throw error;
  }
}

function showFilterPanel(panelSelector: string) {
  const filter = document.querySelector(".filtro") as HTMLElement | null;
  const panel = document.querySelector(panelSelector) as HTMLElement | null;

  if (!filter || !panel) {
    console.error("Elementos não encontrados.");
    return;
  }

  filter.style.display = "none";
  panel.style.display = "block";

  // Verifica se os produtos já foram carregados antes de chamar a API novamente
  if (products.length === 0) {
    atualizarProdutos();
  }
}

function closePanel(panelSelector: string) {
  const filter = document.querySelector(".filtro") as HTMLElement | null;
  const panel = document.querySelector(panelSelector) as HTMLElement | null;

  if (!filter || !panel) {
    console.error("Elementos não encontrados.");
    return;
  }

  filter.style.display = "flex";
  panel.style.display = "none";
}

function ordenarPorDataRecente(produtos: Product[]): Product[] {
  return produtos.slice().sort((a, b) => {
    // Ordene em ordem decrescente com base na propriedade `date`
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

function ordenarPorPrecoMaior(produtos: Product[]): Product[] {
  return produtos.slice().sort((a, b) => {
    return b.price - a.price;
  });
}

function renderProduct(product: Product): HTMLElement {
  const item = document.createElement("div");
  item.classList.add("catalogo__item");

  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.name;

  const title = document.createElement("p");
  title.classList.add("catalogo__item--titulo");
  title.textContent = product.name;

  const priceWrapper = document.createElement("div");
  priceWrapper.classList.add("catalogo__item--preco");

  const price = document.createElement("p");
  price.textContent = "R$ ";

  const priceValue = document.createElement("span");
  priceValue.textContent = product.price.toFixed(2);

  price.appendChild(priceValue);

  const installment = document.createElement("p");
  installment.classList.add("catalogo__item--parcelamento");
  installment.textContent = `até ${
    product.parcelamento[0]
  }x de R$${product.parcelamento[1].toFixed(2)}`;

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

function renderProducts(products: Product[]) {
  const catalog = document.querySelector(".catalogo") as HTMLElement | null;

  if (!catalog) {
    console.error("Elemento de catálogo não encontrado.");
    return;
  }

  catalog.innerHTML = ""; // Limpar conteúdo existente

  products.forEach((product) => {
    const item = renderProduct(product);
    catalog.appendChild(item);
  });
}

async function atualizarProdutos() {
  try {
    const timestamp = new Date().getTime(); // Adiciona um timestamp único
    const response = await fetch(`${serverUrl}/products?timestamp=${timestamp}`);
    if (!response.ok) {
      throw new Error("Erro ao obter dados da API");
    }
    const newProducts = await response.json();
    products = newProducts; 
    renderProducts(products);
    console.log(products);
  } catch (error) {
    console.error(error.message);
  }
}

async function AtualizarProdutoOrdemRecente() {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`${serverUrl}/products?timestamp=${timestamp}`);
    if (!response.ok) {
      throw new Error("Erro ao obter dados da API");
    }
    const newProducts = await response.json();
    products = ordenarPorDataRecente(newProducts);
    renderProducts(products);
    console.log(products);
  } catch (error) {    
    console.error(error.message);
  }
}

async function atualizarProdutoPrecoMaior() {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`${serverUrl}/products?timestamp=${timestamp}`);
    if (!response.ok) {
      throw new Error("Erro ao obter dados da API");
    }
    const newProducts = await response.json();
    products = ordenarPorPrecoMaior(newProducts);
    renderProducts(products);
    console.log(products);
  } catch (error) {    
    console.error(error.message);
  }
    
}


function main() {
  console.log(serverUrl);

  const filtroBtnFiltrar = document.querySelector(
    ".filtro__bntFiltrar"
  ) as HTMLButtonElement | null;
  const filtroBtnOrdenar = document.querySelector(
    ".filtro__bntOrdenar"
  ) as HTMLButtonElement | null;
  const fecharOrdenarBtn = document.querySelector(
    ".fechar-ordenar"
  ) as HTMLElement | null;
  const fecharFiltrarBtn = document.querySelector(
    ".fechar-filtrar"
  ) as HTMLElement | null;
  const ordenarRecenteBtn = document.querySelector(
    "#ordenar__item--recente"
  ) as HTMLElement | null;
  const ordenarPrecoMaiorBtn = document.querySelector(
    "#ordenar__item--preco"
  ) as HTMLElement | null;

  if (
    filtroBtnFiltrar &&
    filtroBtnOrdenar &&
    fecharOrdenarBtn &&
    fecharFiltrarBtn &&
    ordenarRecenteBtn &&
    ordenarPrecoMaiorBtn
  ) {
    const mostrarFiltrar = () => {
      const filtro = document.querySelector(".filtro") as HTMLElement | null;
      const filtrar = document.querySelector(
        ".filtro__filtrar"
      ) as HTMLElement | null;

      if (filtro && filtrar) {
        filtro.style.display = "none";
        filtrar.style.display = "block";
      }
    };

    const mostrarOrdenar = () => {
      const filtro = document.querySelector(".filtro") as HTMLElement | null;
      const ordenar = document.querySelector(
        ".filtro__ordenar"
      ) as HTMLElement | null;

      if (filtro && ordenar) {
        filtro.style.display = "none";
        ordenar.style.display = "block";
      }
    };

    const fecharOrdenar = () => {
      const filtro = document.querySelector(".filtro") as HTMLElement | null;
      const ordenar = document.querySelector(
        ".filtro__ordenar"
      ) as HTMLElement | null;

      if (filtro && ordenar) {
        filtro.style.display = "flex";
        ordenar.style.display = "none";
      }
    };

    const fecharFiltrar = () => {
      const filtro = document.querySelector(".filtro") as HTMLElement | null;
      const filtrar = document.querySelector(
        ".filtro__filtrar"
      ) as HTMLElement | null;

      if (filtro && filtrar) {
        filtro.style.display = "flex";
        filtrar.style.display = "none";
      }
    };

    const ordenarRecente = () => {
      AtualizarProdutoOrdemRecente();
    };

    const ordenarPorPrecoMaior = () => {      
      atualizarProdutoPrecoMaior();
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
  atualizarProdutos();
}

document.addEventListener("DOMContentLoaded", main);
