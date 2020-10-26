const Node = require("./Nodee.js");
const Graph = require("./Graph.js");
let confidence = 0.9,
minViews = 1;

const buyedChar = 'B';
const viewedChar = 'V'

const rawdata = [
    {
        id:'1',
        buyedProducts:['1','2'],
        viewedProducts:['1','2','9','5','6']
    },
    {
        id:'2',
        buyedProducts:['1','2'],
        viewedProducts:['1','2','9','4']
    },
    {
        id:'3',
        buyedProducts:['150','200','1'],
        viewedProducts:['190','130','180','150']
    },
]

const sortByFrequency = (array) => {
    var frequency = {};

    array.forEach(function(value) { frequency[value] = 0; });

    var uniques = array.filter(function(value) {
        return ++frequency[value] == 1;
    });

    return uniques.sort(function(a, b) {
        return frequency[b] - frequency[a];
    });
}

const createGraph = (data)=>{
    const graph = new Graph();
    data.forEach(user => {
        // Creo nodo del usuario
        const userNode = new Node(user.id);        
        if(user.buyedProducts != undefined && user.buyedProducts.length > 0){
            user.buyedProducts.forEach(buyedProduct => {
                // Obtengo el nodo del producto comprado del graph, y si no existe lo creo
                let productNode = graph.getNode(buyedChar + buyedProduct);
                if(productNode === undefined){
                    productNode = new Node(buyedChar + buyedProduct);
                    graph.addNode(productNode)
                }
                // Vinculo el nodo del producto comprado con el usuario
                    userNode.addEdge(productNode);
            })
        }
        if(user.viewedProducts != undefined && user.viewedProducts.length > 0){
            user.viewedProducts.forEach(viewedProduct => {
                // Obtengo el nodo del producto visto del graph, y si no existe lo creo
                let productNode = graph.getNode(viewedChar + viewedProduct);
                if(productNode === undefined){
                    productNode = new Node(viewedChar + viewedProduct);
                    // Agrego el nodo del producto visto al graph para acceder de manera rapida
                    graph.addNode(productNode)
                }
                // Vinculo el nodo del producto visto con el usuario
                userNode.addEdge(productNode);
            })
        }
    })
    return graph
}
generateRecomendations = (graph) => {
    let finalRecomendations = {};
    Object.keys(graph.graph).forEach(buyedProductKey => {
        if(buyedProductKey[0]===viewedChar)return;
        // Creo recomendaciones para cada producto
        let rawRecomendations = [];
        const amountOfBuys = graph.getNode(buyedProductKey).edges.length
        // Si la cantidad de usuarios que compraron el producto es menor a minViews retorno null
        if(amountOfBuys < minViews)return null;
        const buyedProductSku = graph.getNode(buyedProductKey).value.substring(1)
        graph.getNode(buyedProductKey).edges.forEach(userNode => {
            userNode.edges.forEach(buyedProductNode => {
                // Por cada usuario veo los productos que compro y los agrego a rawRecomentadions
                const buyedProduct2Sku = buyedProductNode.value.substring(1)
                if(buyedProductNode.value[0]===viewedChar || buyedProduct2Sku == buyedProductSku)return;
                rawRecomendations.push(buyedProduct2Sku)
            })
        })
        let filteredRecomendations = []
        rawRecomendations.forEach(buyedProduct => {
            const amountOfBuysRecomendation =  rawRecomendations.filter(product => product == buyedProduct).length;
            // Si la cantidad de gente que compro el producto recomendado dividido por la cantidad de gente que compro el producto es menor a confidence no lo agrego
            if(amountOfBuysRecomendation/amountOfBuys>=confidence){
                filteredRecomendations.push(buyedProduct)
            }
        })
        if(filteredRecomendations.length > 0)finalRecomendations[buyedProductSku] = sortByFrequency(filteredRecomendations)

    })
    Object.keys(finalRecomendations).forEach(sku => {
        finalRecomendations[sku].forEach(relatedSku => {
            if(finalRecomendations[relatedSku] === undefined)return finalRecomendations[relatedSku] = [sku];
            if(!finalRecomendations[relatedSku].includes(sku))finalRecomendations[relatedSku].push(sku)
        })
    })
    return finalRecomendations
}
const generateRecomendationsWithViews = (graph) =>{
    let finalRecomendations = {};
    Object.keys(graph.graph).forEach(viewProductKey => {
        if(viewProductKey[0]===buyedChar)return;
        // Creo recomendaciones para cada producto
        let rawRecomendations = [];
        const amountOfViews = graph.getNode(viewProductKey).edges.length
        // Si la cantidad de usuarios que vieron el producto es menor a minViews retorno null
        if(amountOfViews < minViews)return null;
        const viewedProductSku = graph.getNode(viewProductKey).value.substring(1)
        graph.getNode(viewProductKey).edges.forEach(userNode => {
            userNode.edges.forEach(buyedProductNode => {
                // Por cada usuario veo los productos que compro y los agrego a rawRecomentadions
                const buyedProductSku = buyedProductNode.value.substring(1)
                if(buyedProductNode.value[0]===viewedChar || buyedProductSku == viewedProductSku)return;
                rawRecomendations.push(buyedProductSku)
            })
        })
        let filteredRecomendations = []
        rawRecomendations.forEach(buyedProduct => {
            const amountOfBuys =  rawRecomendations.filter(product => product == buyedProduct).length;
            // Si la cantidad de gente que compro el producto recomendado dividido por la cantidad de gente que vio el producto es menor a confidence no lo agrego
            if(amountOfBuys/amountOfViews>=confidence){
                filteredRecomendations.push(buyedProduct)
            }
        })
        if(filteredRecomendations.length > 0)finalRecomendations[viewedProductSku] = sortByFrequency(filteredRecomendations)
    })
    // Por cada recomendacion agrego la recomendacion inversa
    Object.keys(finalRecomendations).forEach(sku => {
        finalRecomendations[sku].forEach(relatedSku => {
            if(finalRecomendations[relatedSku] === undefined)return finalRecomendations[relatedSku] = [sku];
            if(!finalRecomendations[relatedSku].includes(sku))finalRecomendations[relatedSku].push(sku)
        })
    })
    return finalRecomendations
}

const getRecommendations = (data) => {
    const graph = createGraph(data)
    const recomendations = generateRecomendations(graph);
    console.log(recomendations)
}



getRecommendations(rawdata)