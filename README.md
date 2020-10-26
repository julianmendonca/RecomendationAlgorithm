# Algoritmo de recomendacion de productos

Este algoritmo permite hacer 2 relaciones para generar recomendaciones de productos, puede hacer la relacion 'Los que vieron X producto tambien compran Y producto' o tambien 'Los que compraron X producto tambien compran Y producto'.

Hay 2 variables ajustables, "minViews" y "confidence". La variable "minViews" ajusta la cantidad de visitas o compras (dependiendo de que relacion hagas) minimas necesarias para agregar un producto. Por ejemplo si minViews = 2 entonces al producto tien que haberlo visto minimo 2 personas para que se genere recomendaciones.
Por otro lado "confidence" funciona para setear el porcentaje de compra de un producto. Es decir si confidence = 0.5 entonces de los 10 que vieron el producto X, 5 deben de haber comprado el producto Y para recomendarlo

