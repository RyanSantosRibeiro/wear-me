export const wearmeSnippet = "";
export const findMySizeScript = `<!-- Wearme Size Finder & Chart -->
<div id="wearme-size-widget"></div>
<div id="wearme-chart-widget"></div>

<script src="https://wearme.com.br/findMySize.js"></script>
<script src="https://wearme.com.br/sizeChart.js"></script>

<script>
  // Inicializa Recomendador
  FindMySize.init({
    apiKey: 'SUA_CHAVE_AQUI',
    buttonSelector: '#wearme-size-widget',
    targetBrandId: 1, // ID da sua marca
    productImage: 'URL_DA_IMAGEM',
    productName: 'NOME_DO_PRODUTO'
  });

  // Inicializa Tabela de Medidas
  WearmeSizeChart.init({
    apiKey: 'SUA_CHAVE_AQUI',
    tableId: 'ID_DA_TABELA',
    buttonSelector: '#wearme-chart-widget'
  });
</script>`