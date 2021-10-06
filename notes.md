
## express

* `app.METHOD` normaliza a string da rota que foi acessada, ou seja, não há necessidade de manipular a string da rota.

* `app.use` serve para adicionar middlewares

* rotas com `*` são considerados wildcards, qualquer string pode ser encaixada no *. Ex: `/about*` é valido para `/about/contact` e `/about/directions`

## jest

* criando uma função 'mockada' com jest
```js
const mockedFunc = jest.fn()

mockedFunc.mock.calls[0][0]
```

a propriedade 'calls' retorna um array de arrays onde o primeiro armazena as chamadas da função mockada e o segundo os argumentos da respectiva chamada.


