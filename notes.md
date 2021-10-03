* `app.METHOD` normaliza a string da rota que foi acessada, ou seja, não há necessidade de manipular a string da rota.

* `app.use` serve para adicionar middlewares

* rotas com `*` são considerados wildcards, qualquer string pode ser encaixada no *. Ex: `/about*` é valido para `/about/contact` e `/about/directions`