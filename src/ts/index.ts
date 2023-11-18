import { Product } from "./Product";

const serverUrl = "http://localhost:5000";
let products: Product[] = [];
let itensNoCarrinho = 0;

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


function adicionarAoCarrinho(produto: Product) {
  itensNoCarrinho++;
  atualizarContadorCarrinho();
}

function atualizarContadorCarrinho() {
  const contadorCarrinho = document.getElementById("contadorCarrinho");
  if (contadorCarrinho) {
    contadorCarrinho.textContent = String(itensNoCarrinho);
  }
}

function ordenarProdutosPorDataRecente(produtos: Product[]): Product[] {
  return produtos
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function ordenarProdutosPorPrecoMaior(produtos: Product[]): Product[] {
  console.log(produtos.slice().sort((a, b) => b.price - a.price));
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
    return true;
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
    return tamanhosSelecionados.some((tamanho) => {
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
  buyButton.addEventListener("click", () => adicionarAoCarrinho(produto));

  priceWrapper.appendChild(price);
  priceWrapper.appendChild(installment);

  item.appendChild(image);
  item.appendChild(title);
  item.appendChild(priceWrapper);
  item.appendChild(buyButton);

  return item;
}

let limiteInicial = 9;
let limiteInicialMobile = 4;

function renderizarProdutos(produtos: Product[], limite: number) {
  const catalogo = document.querySelector(".catalogo") as HTMLElement | null;

  if (!catalogo) {
    console.error("Elemento de catálogo não encontrado.");
    return;
  }

  
  const isTelaPequena = window.matchMedia("(max-width: 992px)").matches;
  console.log("Is Tela Pequena:", isTelaPequena);


  let limiteParaRenderizar = isTelaPequena ? limiteInicialMobile : limite;
  console.log("Limite para Renderizar:", limiteParaRenderizar);

  
  const renderizar = (limite: number) => {
    const produtosParaExibir = produtos.slice(0, limite);
    console.log("Produtos para Exibir:", produtosParaExibir);

    catalogo.innerHTML = "";

    produtosParaExibir.forEach((produto) => {
      const item = renderizarProduto(produto);
      catalogo.appendChild(item);
    });

    if (produtos.length > limite) {
      console.log("Total de Produtos:", produtos.length);

      const loadMoreButton = document.createElement("button");
      loadMoreButton.classList.add("carregarMais__desktop");
      loadMoreButton.textContent = "CARREGAR MAIS";
      loadMoreButton.addEventListener("click", () => {
        limiteParaRenderizar += isTelaPequena ? limiteInicialMobile : 9;
        console.log("Novo Limite:", limiteParaRenderizar);


        renderizar(limiteParaRenderizar);
      });

      catalogo.appendChild(loadMoreButton);
    }
  };


  renderizar(limiteParaRenderizar);
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


    const coresSelecionadas = obterCoresSelecionadas();


    const produtosFiltrados = novosProdutos.filter((produto: any) => {
      return (
        coresSelecionadas.length === 0 ||
        coresSelecionadas.includes(produto.color)
      );
    });

    products = produtosFiltrados;
    renderizarProdutos(products, limiteInicial);
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
    renderizarProdutos(products, limiteInicial);
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
    renderizarProdutos(products, limiteInicial);
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
    renderizarProdutos(products, limiteInicial);
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
    console.log("AQUI");
    renderizarProdutos(products, limiteInicial);
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
    renderizarProdutos(products, limiteInicial);
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
    renderizarProdutos(products, limiteInicial);
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


    const faixasSelecionadas = Array.from(
      document.querySelectorAll(
        ".dropdown-content__item--valores input[type='radio']:checked"
      )
    ).map((radio) => (radio as HTMLInputElement).id);


    const produtosFiltrados = newProducts.filter((produto: Product) =>
      verificaFaixaDePreco(produto.price, faixasSelecionadas)
    );

    products = produtosFiltrados;
    renderizarProdutos(products, limiteInicial);
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
  const ordenarRecenteBtnMobile = document.querySelector(
    "#ordenar__item--recente-mobile"
  ) as HTMLElement | null;
  const ordenarPrecoMaiorBtn = document.querySelector(
    "#ordenar__item--preco"
  ) as HTMLElement | null;
  const ordenarPrecoMaiorBtnMobile = document.querySelector(
    "#ordenar__item--preco-mobile"
  ) as HTMLElement | null;
  const ordenarPrecoMenorBtn = document.querySelector(
    "#ordenar__item--precoMenor"
  ) as HTMLElement | null;
  const ordenarPrecoMenorBtnMobile = document.querySelector(
    "#ordenar__item--precoMenor-mobile"
  ) as HTMLElement | null;

  if (
    filtroBtnFiltrar &&
    filtroBtnOrdenar &&
    fecharOrdenarBtn &&
    fecharFiltrarBtn &&
    ordenarRecenteBtn &&
    ordenarRecenteBtnMobile &&
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
    ordenarRecenteBtnMobile.addEventListener("click", ordenarRecente);
    ordenarPrecoMaiorBtn.addEventListener("click", ordenarPorPrecoMaior);
    ordenarPrecoMaiorBtnMobile.addEventListener("click", ordenarPorPrecoMaior);
    ordenarPrecoMenorBtn.addEventListener("click", ordenarPorPrecoMenor);
    ordenarPrecoMenorBtnMobile.addEventListener("click", ordenarPorPrecoMenor);
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
      atualizarProdutosFiltrosCores();
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
      atualizarProdutosFiltrosCores(); 
    });
  }
}

function mostrarOcultarOrdenarList() {
  const ordenarList = document.querySelector(".ordenar__list") as HTMLElement;

  if (ordenarList.style.display === "flex") {
    ordenarList.style.display = "none";
  } else {
    ordenarList.style.display = "flex";
  }
}

function toggleOrdenarItemsDisplay() {
  const ordenarItems = document.querySelectorAll(".ordenar__item--desktop");

  ordenarItems.forEach((item) => {
    if (item instanceof HTMLElement) {
      if (item.style.display === "flex") {
        item.style.display = "none";
      } else {
        item.style.display = "flex";
      }
    }
  });
}

function configurarEventoTituloOrdenar() {
  const tituloOrdenar = document.querySelector(".titulo__ordenar");

  if (tituloOrdenar) {
    tituloOrdenar.addEventListener("click", () => {
      mostrarOcultarOrdenarList();
      toggleOrdenarItemsDisplay();
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const verTodasCoresBtn = document.getElementById("verTodasCoresBtn");

  if (verTodasCoresBtn) {
    verTodasCoresBtn.addEventListener("click", function () {
      // Exibe todas as cores ocultas
      const coresItens = document.querySelectorAll("#cores__ocultas");
      coresItens.forEach((item) => {
        if (item instanceof HTMLElement) {
          // Verifica o estilo atual
          const currentDisplayStyle = window
            .getComputedStyle(item)
            .getPropertyValue("display");
          // Verifica se o estilo atual é "flex"
          if (currentDisplayStyle === "flex") {
            item.style.display = "none";
          } else {
            item.style.display = "flex";
          }
        }
      });
    });
  }
});

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
  configurarEventoTituloOrdenar();
}

document.addEventListener("DOMContentLoaded", iniciarAplicacao);
