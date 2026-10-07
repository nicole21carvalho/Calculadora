const telaExpressao = document.getElementById('expressao');
const telaResultado = document.getElementById('resultado');
const teclado = document.querySelector('.teclado');

const OPERADORES = ['+', '-', '*', '/'];
const SIMBOLOS = { '*': '×', '/': '÷', '-': '−' };

let expressao = '';
let acabouDeCalcular = false;

function formatar(texto) {
  return texto.replace(/[*/-]/g, (op) => SIMBOLOS[op]).replace(/\./g, ',');
}

function atualizarTela(resultado = '') {
  telaExpressao.textContent = formatar(expressao) || '0';
  telaResultado.textContent = resultado;
}

function ultimoNumero() {
  return expressao.split(/[+*/]|(?<=\d)-/).pop();
}

function inserir(valor) {
  const ehOperador = OPERADORES.includes(valor);

  if (acabouDeCalcular && !ehOperador) expressao = '';
  acabouDeCalcular = false;

  if (ehOperador) {
    const ultimo = expressao.slice(-1);
    if (expressao === '' && valor !== '-') return;
    if (OPERADORES.includes(ultimo)) {
      // Troca o operador anterior, mas permite número negativo depois de × ou ÷
      if (valor === '-' && (ultimo === '*' || ultimo === '/')) {
        expressao += valor;
      } else {
        expressao = expressao.replace(/[+\-*/]+$/, '') + valor;
      }
      atualizarTela();
      return;
    }
  }

  if (valor === '.') {
    if (ultimoNumero().includes('.')) return;
    if (ultimoNumero() === '' || ultimoNumero() === '-') valor = '0.';
  }

  expressao += valor;
  atualizarTela();
}

function apagar() {
  acabouDeCalcular = false;
  expressao = expressao.slice(0, -1);
  atualizarTela();
}

function limpar() {
  acabouDeCalcular = false;
  expressao = '';
  atualizarTela();
}

function calcular() {
  if (!expressao) return;
  try {
    const resultado = avaliar(expressao);
    atualizarTela('= ' + formatar(String(resultado)));
    expressao = String(resultado);
    acabouDeCalcular = true;
  } catch (erro) {
    atualizarTela(erro.message);
  }
}

teclado.addEventListener('click', (evento) => {
  const botao = evento.target.closest('button');
  if (!botao) return;

  const { acao, valor } = botao.dataset;
  if (acao === 'limpar') limpar();
  else if (acao === 'apagar') apagar();
  else if (acao === 'calcular') calcular();
  else inserir(valor);
});

document.addEventListener('keydown', (evento) => {
  const tecla = evento.key;
  if (/^[0-9]$/.test(tecla) || OPERADORES.includes(tecla)) inserir(tecla);
  else if (tecla === '.' || tecla === ',') inserir('.');
  else if (tecla === 'Enter' || tecla === '=') { evento.preventDefault(); calcular(); }
  else if (tecla === 'Backspace') apagar();
  else if (tecla === 'Escape' || tecla === 'Delete') limpar();
});

atualizarTela();
