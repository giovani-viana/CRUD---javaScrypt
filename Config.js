'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => { //Retirar essa parte 
    limpaCampo()
    document.getElementById('modal').classList.remove('active')
}

const productManager = {
            nome: "Maça",
            id: "11092002",
            validade: "30/11/2022",
            preço: "4,99",
}
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_produto')) ?? []
const setLocalStorage = (dbProduto) => localStorage.setItem("db_produto", JSON.stringify(dbProduto))
//Funções

//CREATE Função recebe o elemento produto e armazena seus dados no local Storage 
//usando a função setItem
    const criarProduto = (produto) =>{
        const dbProduto = getLocalStorage()
        dbProduto.push(produto)
        setLocalStorage(dbProduto)
    }
    
//READ    
const lerProduto = () => getLocalStorage()

//UPDATE
const atualizarProduto = (index, produto) =>{
    const dbProduto = lerProduto()
    dbProduto[index] = produto
    setLocalStorage(dbProduto)
} 
//DELETE
const deletarProduto = (index) => {
    const dbProduto = lerProduto()
    dbProduto.splice(index, 1)
    setLocalStorage(dbProduto)
}

//EVENTOS
const campoValido = () =>{
    return document.getElementById('form').reportValidity()
}

const limpaCampo = () => {
    const campos = document.querySelectorAll('.modal-field') //Retorna um array com todos os elementos que ele achar da classe "modal-field"
    campos.forEach(campos => campos.value = "") //irá varrer todos os campos  
}
const salvarProduto = () => {
    if(campoValido()){
        const produto = {
            nome: document.getElementById('nome').value,   
            id: document.getElementById('id').value,  
            validade: document.getElementById('validade').value,  
            preço: document.getElementById('preço').value,  
        }

        const index = document.getElementById('nome').dataset.index
        if(index == 'novo'){
            criarProduto(produto)
            refresh()
            closeModal()
        } 
        else {
            atualizarProduto(index, produto)
            refresh()
            closeModal()
        }
        
    }
}    

const criarLinha = (produto, indice) => {
    const novaLinha = document.createElement('tr') //Cria a linha vazia 
    novaLinha.innerHTML =  //Preenche as linahs com as informações na base de dados 
    `
        <td>${produto.nome}</td>
        <td>${produto.id}</td>
        <td>${produto.preço}</td>
        <td>${produto.validade}</td>
        <td>
            <button type="button" class="botão editar" id = "editar-${indice}">editar</button>
            <button type="button" class="botão excluir" id = "deletar-${indice}">excluir</button>
        </td>
    `
    document.querySelector('#tabelaProdutos>tbody').appendChild(novaLinha)
    }

    const limparTabela = () => {
        const linhas = document.querySelectorAll('#tabelaProdutos>tbody tr') //Ao inves de pegar a tabela toda, vai pegar só as linhas 
        linhas.forEach(row => row.parentNode.removeChild(row))
    }

const refresh = () => { // função responsável por ler os dados do local storage
    const dbProduto = lerProduto() //Vai ler os dados do local storage
    limparTabela()
    dbProduto.forEach(criarLinha) //Cria uma linha para cada produto registrado na base de dados
}

const preencheCampo = (products) => {
    document.getElementById('nome').value = products.nome
    document.getElementById('id').value = products.id
    document.getElementById('preço').value = products.preço
    document.getElementById('validade').value = products.validade
    document.getElementById('nome').dataset.index = products.index
}

const editarProduto = (indice) => {
    const products = lerProduto()[indice]
    products.index = indice
    preencheCampo(products)
    openModal()
}

const deletar = (clique) => {
    if (event.target.type == 'button') {

        const [ação, indice] = event.target.id.split('-')

        if(ação	== 'editar'){
            editarProduto(indice)
        } else{
            const check = confirm(`Exluir o produto?`)
            if(check){
                deletarProduto(indice)
                refresh()
            }
        }
    }
}
   

refresh()

document.getElementById('cadastrarProduto').addEventListener('click', openModal)
document.getElementById('modalClose').addEventListener('click', closeModal)
document.getElementById('salvar').addEventListener('click', salvarProduto)
document.querySelector('#tabelaProdutos>tbody').addEventListener('click', deletar)