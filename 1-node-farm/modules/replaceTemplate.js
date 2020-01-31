module.exports = (temp, product) => {
    let output = temp.replace(/{%ARTICLE_URL%}/g, product.content.article_url);
    output = output.replace(/{%CONTENT%}/g, product.content.content);
    output = output.replace(/{%PUBLISHED_AT%}/g, product.content.published_at);
    output = output.replace(/{%TITLE%}/g, product.content.title);
    output = output.replace(/{%ID%}/g, product.content.id);

    return output;
}