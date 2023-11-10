import { Product } from "./Product";

const serverUrl = "http://localhost:5000";

function main() {
  console.log(serverUrl);  
  const filtroBtnFiltrar = document.querySelector('.filtro__bntFiltrar') as HTMLButtonElement | null;
  const filtroBtnOrdenar = document.querySelector('.filtro__bntOrdenar') as HTMLButtonElement | null;
  const fecharOrdenarBtn = document.querySelector('.fechar-ordenar') as HTMLButtonElement | null;

  if (filtroBtnFiltrar && filtroBtnOrdenar && fecharOrdenarBtn) {
    const mostrarFiltrar = () => {
      const filtro = document.querySelector('.filtro') as HTMLElement | null;
      const ordenar = document.querySelector('.filtro__ordenar') as HTMLElement | null;

      if (filtro && ordenar) {
        filtro.style.display = 'flex';
        ordenar.style.display = 'none';
      }
    };

    const mostrarOrdenar = () => {
      const filtro = document.querySelector('.filtro') as HTMLElement | null;
      const ordenar = document.querySelector('.filtro__ordenar') as HTMLElement | null;

      if (filtro && ordenar) {
        filtro.style.display = 'none';
        ordenar.style.display = 'block';
      }
    };

    const fecharOrdenar = () => {
      const filtro = document.querySelector('.filtro') as HTMLElement | null;
      const ordenar = document.querySelector('.filtro__ordenar') as HTMLElement | null;

      if (filtro && ordenar) {
        filtro.style.display = 'flex';
        ordenar.style.display = 'none';
      }
    };

    filtroBtnFiltrar.addEventListener('click', mostrarFiltrar);
    filtroBtnOrdenar.addEventListener('click', mostrarOrdenar);
    fecharOrdenarBtn.addEventListener('click', fecharOrdenar);
  } else {
    console.error("Botões não encontrados.");
  }
}

document.addEventListener("DOMContentLoaded", main);


