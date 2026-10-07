// Avaliador de expressões aritméticas (+ - * /) sem usar eval.
// Usa o algoritmo shunting-yard para respeitar a precedência dos operadores.

const PRECEDENCIA = { '+': 1, '-': 1, '*': 2, '/': 2 };

function separarTokens(expressao) {
  const tokens = [];
  let numero = '';

  for (const caractere of expressao) {
    if (/[0-9.]/.test(caractere)) {
      numero += caractere;
      continue;
    }
    if (!(caractere in PRECEDENCIA)) {
      throw new Error('Caractere inválido');
    }

    const anterior = tokens[tokens.length - 1];
    const ehSinalDoNumero =
      caractere === '-' && numero === '' && (anterior === undefined || anterior in PRECEDENCIA);

    if (ehSinalDoNumero) {
      numero = '-';
      continue;
    }
    if (numero === '' || numero === '-') {
      throw new Error('Expressão incompleta');
    }
    tokens.push(numero, caractere);
    numero = '';
  }

  if (numero === '' || numero === '-') {
    throw new Error('Expressão incompleta');
  }
  tokens.push(numero);
  return tokens;
}

function paraNumero(token) {
  if ((token.match(/\./g) || []).length > 1) {
    throw new Error('Número inválido');
  }
  return Number(token);
}

function aplicar(operador, a, b) {
  switch (operador) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/':
      if (b === 0) throw new Error('Divisão por zero');
      return a / b;
  }
}

function avaliar(expressao) {
  const valores = [];
  const operadores = [];

  const resolverTopo = () => {
    const b = valores.pop();
    const a = valores.pop();
    valores.push(aplicar(operadores.pop(), a, b));
  };

  for (const token of separarTokens(expressao)) {
    if (token in PRECEDENCIA) {
      while (operadores.length && PRECEDENCIA[operadores[operadores.length - 1]] >= PRECEDENCIA[token]) {
        resolverTopo();
      }
      operadores.push(token);
    } else {
      valores.push(paraNumero(token));
    }
  }
  while (operadores.length) resolverTopo();

  // Corrige imprecisões de ponto flutuante, como 0.1 + 0.2 = 0.30000000000000004
  return Number(valores[0].toPrecision(12));
}

if (typeof module !== 'undefined') {
  module.exports = { avaliar };
}
