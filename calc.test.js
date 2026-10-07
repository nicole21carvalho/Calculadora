// Rode com: node --test
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { avaliar } = require('./calc.js');

test('respeita a precedência dos operadores', () => {
  assert.equal(avaliar('2+3*4'), 14);
  assert.equal(avaliar('10-6/2'), 7);
  assert.equal(avaliar('8/4/2'), 1);
  assert.equal(avaliar('10-3-2'), 5);
});

test('aceita decimais e corrige imprecisão de ponto flutuante', () => {
  assert.equal(avaliar('0.1+0.2'), 0.3);
  assert.equal(avaliar('1.5*2'), 3);
});

test('aceita números negativos', () => {
  assert.equal(avaliar('-5+2'), -3);
  assert.equal(avaliar('6*-2'), -12);
  assert.equal(avaliar('6/-3'), -2);
});

test('avisa sobre divisão por zero', () => {
  assert.throws(() => avaliar('5/0'), /Divisão por zero/);
});

test('rejeita expressões inválidas', () => {
  assert.throws(() => avaliar('5+'), /incompleta/);
  assert.throws(() => avaliar('1.2.3+1'), /inválido/);
  assert.throws(() => avaliar('alert(1)'), /inválido/);
});
