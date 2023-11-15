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
  if (element.classList.value != "filtro") {
    element.style.display = "block";
  } else {
    element.style.display = "flex";
  }
}

function ordenarProdutosPorDataRecente(produtos: Product[]): Product[] {
  return produtos
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function ordenarProdutosPorPrecoMaior(produtos: Product[]): Product[] {
  return produtos.slice().sort((a, b) => b.price - a.price);
}

function ordenarProdutosPorPrecoMenor(produtos: Product[]): Product[] {
  return produtos.slice().sort((a, b) => a.price - b.price);
}

function obterCoresSelecionadas(): string[] {
  const checkboxesCores = document.querySelectorAll(
    ".dropdown-content__item input[type='checkbox']"
  );
  const coresSelecionadas: string[] = [];

  checkboxesCores.forEach((checkbox) => {
    if ((checkbox as HTMLInputElement).checked) {
      const cor = (checkbox.nextElementSibling as HTMLElement).textContent;
      coresSelecionadas.push(cor);
    }
  });
  console.log(coresSelecionadas);
  return coresSelecionadas;
}

function verificaFaixaDePreco(preco: number, faixas: string[]): boolean {
  if (faixas.length === 0) {
    return true; // Nenhuma faixa selecionada, todos os preços são válidos
  }

  return faixas.some((faixa) => {
    switch (faixa) {
      case "faixa-0-50":
        return preco >= 0 && preco <= 50;
      case "faixa-51-150":
        return preco > 50 && preco <= 150;
      case "faixa-151-300":
        return preco > 150 && preco <= 300;
      case "faixa-301-500":
        return preco > 300 && preco <= 500;
      case "faixa-500-mais":
        return preco > 500;
      default:
        return false;
    }
  });
}

function filtrarPorTamanho(produtos: Product[]): Product[] {
  const checkboxesTamanho = document.querySelectorAll(
    ".dropdownTamanho__item input[type='checkbox']:checked"
  );

  if (checkboxesTamanho.length === 0) {
    return produtos;
  }

  const tamanhosSelecionados = Array.from(checkboxesTamanho).map((checkbox) =>
    (checkbox as HTMLInputElement).id.replace("tam-", "").toUpperCase()
  );

  console.log(tamanhosSelecionados);

  return produtos.filter((produto) => {
    // Verifica se há alguma interseção entre os tamanhos selecionados e o array "size" do produto
    return tamanhosSelecionados.some((tamanho) => {
      // Verifica se o tamanho está presente diretamente no array ou dentro de um array
      return (
        produto.size.includes(tamanho) ||
        (Array.isArray(produto.size[0]) && produto.size[0].includes(tamanho))
      );
    });
  });
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
  installment.textContent = `até ${
    produto.parcelamento[0]
  }x de R$${produto.parcelamento[1].toFixed(2)}`;

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

async function atualizarProdutosFiltrosCores() {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(
      `${serverUrl}/products?timestamp=${timestamp}`
    );

    if (!response.ok) {
      throw new Error("Erro ao obter dados da API");
    }

    const novosProdutos = await response.json();

    // Obtenha as cores selecionadas
    const coresSelecionadas = obterCoresSelecionadas();

    // Filtre os produtos com base nas cores selecionadas
    const produtosFiltrados = novosProdutos.filter((produto: any) => {
      return (
        coresSelecionadas.length === 0 ||
        coresSelecionadas.includes(produto.color)
      );
    });

    products = produtosFiltrados;
    renderizarProdutos(products);
    console.log(products);
  } catch (error) {
    console.error(error.message);
  }
}

async function atualizarProdutosTamanhoCorPreco() {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(
      `${serverUrl}/products?timestamp=${timestamp}`
    );
    if (!response.ok) {
      throw new Error("Erro ao obter dados da API");
    }
    const newProducts = await response.json();

    const coresSelecionadas = obterCoresSelecionadas();
    const tamanhosSelecionados = Array.from(
      document.querySelectorAll(
        ".dropdownTamanho__item input[type='checkbox']:checked"
      )
    ).map((checkbox) =>
      (checkbox as HTMLInputElement).id.replace("tam-", "").toUpperCase()
    );
    
    const faixasSelecionadas = Array.from(
      document.querySelectorAll(
        ".dropdown-content__item--valores input[type='radio']:checked"
      )
    ).map((radio) => (radio as HTMLInputElement).id);

    const produtosFiltrados = newProducts.filter((produto: Product) => {
      const corValida =
        coresSelecionadas.length === 0 ||
        coresSelecionadas.includes(produto.color);
      const tamanhoValido =
        tamanhosSelecionados.length === 0 ||
        tamanhosSelecionados.some((tamanho) => produto.size.includes(tamanho));
      const precoValido =
        faixasSelecionadas.length === 0 ||
        verificaFaixaDePreco(produto.price, faixasSelecionadas);

      return corValida && tamanhoValido && precoValido;
    });

    products = produtosFiltrados;
    renderizarProdutos(products);
    console.log(products);
  } catch (error) {
    console.error(error.message);
  }
}

async function atualizarProdutos() {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(
      `${serverUrl}/products?timestamp=${timestamp}`
    );

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
    const response = await fetch(
      `${serverUrl}/products?timestamp=${timestamp}`
    );

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
    const response = await fetch(
      `${serverUrl}/products?timestamp=${timestamp}`
    );

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

async function atualizarProdutosPorPrecoMenor() {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(
      `${serverUrl}/products?timestamp=${timestamp}`
    );

    if (!response.ok) {
      throw new Error("Erro ao obter dados da API");
    }

    const novosProdutos = await response.json();
    products = ordenarProdutosPorPrecoMenor(novosProdutos);
    renderizarProdutos(products);
    console.log(products);
  } catch (error) {
    console.error(error.message);
  }
}

async function atualizarProdutosTamanho() {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(
      `${serverUrl}/products?timestamp=${timestamp}`
    );
    if (!response.ok) {
      throw new Error("Erro ao obter dados da API");
    }
    const newProducts = await response.json();

    const produtosFiltrados = filtrarPorTamanho(newProducts);

    products = produtosFiltrados;
    renderizarProdutos(products);
    console.log(products);
  } catch (error) {
    console.error(error.message);
  }
}

async function atualizarProdutosPreco() {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(
      `${serverUrl}/products?timestamp=${timestamp}`
    );
    if (!response.ok) {
      throw new Error("Erro ao obter dados da API");
    }
    const newProducts = await response.json();

    // Obtenha as faixas de preço selecionadas
    const faixasSelecionadas = Array.from(
      document.querySelectorAll(
        ".dropdown-content__item--valores input[type='radio']:checked"
      )
    ).map((radio) => (radio as HTMLInputElement).id);

    // Filtre os produtos com base nas faixas de preço selecionadas
    const produtosFiltrados = newProducts.filter((produto: Product) =>
      verificaFaixaDePreco(produto.price, faixasSelecionadas)
    );

    products = produtosFiltrados;
    renderizarProdutos(products);
    console.log(products);
  } catch (error) {
    console.error(error.message);
  }
}


function configurarEventosCheckboxPreco() {
  const checkboxesPreco = document.querySelectorAll(
    ".dropdown-content__item--valores input[type='radio']"
  );

  checkboxesPreco.forEach((checkbox) => {
    checkbox.addEventListener("click", () => {
      atualizarProdutosPreco();
    });
  });
}

function configurarBotoes() {
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
  const ordenarPrecoMenorBtn = document.querySelector(
    "#ordenar__item--precoMenor"
  ) as HTMLElement | null;

  if (
    filtroBtnFiltrar &&
    filtroBtnOrdenar &&
    fecharOrdenarBtn &&
    fecharFiltrarBtn &&
    ordenarRecenteBtn &&
    ordenarPrecoMaiorBtn &&
    ordenarPrecoMenorBtn
  ) {
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

    const ordenarPorPrecoMenor = () => {
      atualizarProdutosPorPrecoMenor();
    };

    filtroBtnFiltrar.addEventListener("click", mostrarFiltrar);
    filtroBtnOrdenar.addEventListener("click", mostrarOrdenar);
    fecharOrdenarBtn.addEventListener("click", fecharOrdenar);
    fecharFiltrarBtn.addEventListener("click", fecharFiltrar);
    ordenarRecenteBtn.addEventListener("click", ordenarRecente);
    ordenarPrecoMaiorBtn.addEventListener("click", ordenarPorPrecoMaior);
    ordenarPrecoMenorBtn.addEventListener("click", ordenarPorPrecoMenor);
  } else {
    console.error("Botões não encontrados.");
  }
}

function configurarEventosCheckboxCores() {
  const checkboxesCores = document.querySelectorAll(
    ".dropdown-content__item input[type='checkbox']"
  );

  checkboxesCores.forEach((checkbox) => {
    checkbox.addEventListener("click", () => {
      atualizarProdutosFiltrosCores(); // Atualize os produtos quando um checkbox de cor for clicado
    });
  });
}

function configurarEventosCheckboxTamanho() {
  const checkboxesTamanho = document.querySelectorAll(
    ".dropdownTamanho__item input[type='checkbox']"
  );

  checkboxesTamanho.forEach((checkbox) => {
    checkbox.addEventListener("click", () => {
      atualizarProdutosTamanho();
    });
  });
}

function configurarEventosCheckboxTamanhoCorPreco() {
  const checkboxesTamanho = document.querySelectorAll(
    ".dropdownTamanho__item input[type='checkbox']"
  );
  checkboxesTamanho.forEach((checkbox) => {
    checkbox.addEventListener("click", () => {
      atualizarProdutosTamanhoCorPreco();
    });
  });

  const checkboxesCores = document.querySelectorAll(
    ".dropdown-content__item input[type='checkbox']"
  );
  checkboxesCores.forEach((checkbox) => {
    checkbox.addEventListener("click", () => {
      atualizarProdutosTamanhoCorPreco();
    });
  });

  const checkboxesPreco = document.querySelectorAll(
    ".dropdown-content__item--valores input[type='radio']"
  );
  checkboxesPreco.forEach((checkbox) => {
    checkbox.addEventListener("click", () => {
      atualizarProdutosTamanhoCorPreco();
    });
  });
}

function configurarEventoFiltroCor() {
  const filtroCorBtn = document.getElementById("filtro-cor-btn");

  if (filtroCorBtn) {
    filtroCorBtn.addEventListener("click", () => {
      atualizarProdutosFiltrosCores(); // Atualize os produtos quando o botão de filtro for clicado
    });
  }
}

function configurarEventos() {
  configurarEventosCheckboxCores();
  configurarEventoFiltroCor();
  configurarEventosCheckboxTamanho();
  configurarEventosCheckboxPreco();
  configurarEventosCheckboxTamanhoCorPreco();
}

function iniciarAplicacao() {
  console.log(serverUrl);
  configurarBotoes();
  atualizarProdutos();
  configurarEventos();
}

document.addEventListener("DOMContentLoaded", iniciarAplicacao);
