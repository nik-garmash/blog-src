const fs = require('fs')
const path = require('path')
const { renderTemplate } = require('teig')

const { assetsUrl, articlesUrl } = require('../../config')
const readArticleMarkdown = require('../../helpers/render-markdown')

const LIST_TEMPLATE = fs.readFileSync(path.join(__dirname, './articles-list.component.html'), 'utf8')
const ITEM_TEMPLATE = fs.readFileSync(path.join(__dirname, './item.html'), 'utf8')
const STYLES_TEMPLATE = fs.readFileSync(path.join(__dirname, './styles.html'), 'utf8')

class ArticlesList {
  static get styles () {
    const stylesUrl = `${ assetsUrl }/components/articles-list/articles-list.component.css`

    return renderTemplate(STYLES_TEMPLATE, { stylesUrl })
  }

  renderItems (articleIds) {
    return articleIds
      .map((id) => {
        const article = readArticleMarkdown(id)

        return renderTemplate(ITEM_TEMPLATE, {
          title: article.metadata.title,
          date: article.metadata.publishDate,
          url: `${ articlesUrl }/${ id }/`
        })
      })
      .join('')
  }

  render (attrs) {
    let articleIds

    try {
      articleIds = JSON.parse(attrs['ids'])
    } catch (e) {
      throw new Error('Could not parse JSON inside "ids" attribute value')
    }

    const items = this.renderItems(articleIds)

    return renderTemplate(LIST_TEMPLATE, { items })
  }
}

module.exports = ArticlesList
