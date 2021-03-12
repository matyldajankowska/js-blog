'use strict';
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTag: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML),
  articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
};
const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optArticleAuthorSelector = '.post-author',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = '5',
  optCloudClassPrefix = 'tag-size-';

const titleClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this;
  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  clickedElement.classList.add('active');
  const activeArticles = document.querySelectorAll('.posts article.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  const selectedArticle = clickedElement.getAttribute('href');
  const findArticle = document.querySelector(selectedArticle);
  findArticle.classList.add('active');
};
function generateTitleLinks(customSelector = '') {
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';

  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();

function calculateTagsParams(tags){
  let max = 0, min = 99999, tagsParams = {min, max};
  console.log(calculateTagsParams);

  for (let tag in tags) {
      console.log(tag + ' is used ' + tags[tag] + ' times');
    tagsParams.max = Math.max(tags[tag], tagsParams.max);
    tagsParams.min = Math.min(tags[tag], tagsParams.min);
  }
  return tagsParams;
}
function calculateAuthorsParams(authors){
  let max = 0, min = 99999, authorsParams = {min, max};
  console.log(calculateTagsParams);

  for (let author in authors) {
    authorsParams.max = Math.max(authors[author], authorsParams.max);
    authorsParams.min = Math.min(authors[author], authorsParams.min);
  }
  return authorsParams;
}
function calculateTagClass(count,params){
  const normalizedCount = count - params.min,
    normalizedMax = params.max - params.min,
    percentage = normalizedCount / normalizedMax,
    classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return optCloudClassPrefix + classNumber;
}

function generateTags(){
    /* [NEW] create a new variable allTags with an empty object */

    let allTags = {};

    /* find all articles */

    const articles = document.querySelectorAll('.post');

    /* START LOOP: for every article: */

    for(let article of articles){

        /* find tags wrapper */

        const tagWrapper = article.querySelector(optArticleTagsSelector);

        /* make html variable with empty string */

        let html = '';

        /* get tags from data-tags attribute */

        const articleTags = article.getAttribute('data-tags');

        console.log(articleTags);

        /* split tags into array */

        const articleTagsArray = articleTags.split(' ');

        /* START LOOP: for each tag */

        for(let tag of articleTagsArray){

            /* generate HTML of the link */

            const linkHTMLData = {id: articleTags , title: tag };
            const linkHTML = templates.articleLink(linkHTMLData);

            console.log(linkHTML);

            /* add generated code to html variable */

            html += linkHTML + ' ';

            /* [NEW] check if this link is NOT already in allTags */
            if(!allTags[tag]) {
                /* [NEW] add tag to allTags object */
                allTags[tag] = 1;
            } else {
                allTags[tag]++;
            }
        }
        /* END LOOP: for each tag */

        console.log('END LOOP: for each tag');

        /* insert HTML of all the links into the tags wrapper */
        console.log('insert HTML');

        tagWrapper.innerHTML = html;

        console.log('END LOOP: for every article');
    }

    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector('.tags');

    const tagsParams = calculateTagsParams(allTags);

    console.log('tagsParams:', tagsParams);

    /* [NEW] create variable for all links HTML code */

    const allTagsData = {tags: []};

    /* [NEW] START LOOP: for each tag in allTags: */

    for(let tag in allTags){

        /* [NEW] generate code of a link and add it to allTagsHTML */

        const tagLinkHTML = calculateTagClass(allTags[tag], tagsParams);
        console.log('tagLinkHTML:', tagLinkHTML);

        allTagsData.tags.push({

            tag: tag,

            count: allTags[tag],

            className: calculateTagClass(allTags[tag], tagsParams)
        });
    }

    /* [NEW] END LOOP: for each tag in allTags: */

    /*[NEW] add HTML from allTagsHTML to tagList */

    tagList.innerHTML = templates.tagCloudLink(allTagsData);

    console.log(allTagsData);
}


generateTags();

function tagClickHandler(event){
  event.preventDefault();
  const clickedElement = this,
    href = clickedElement.getAttribute('href'),
    tag = href.replace('#tag-', ''),
    activeTags = document.querySelectorAll('a.active[href^="#tag-"]');


  for (let activeTag of activeTags){
    activeTag.classList.remove('active');
  }

  const clickedTags = document.querySelectorAll('a[href="' + href + '"]');

  for (let clickedTag of clickedTags){
    clickedTag.classList.add('active');
  }

  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  const tags = document.querySelectorAll('a[href^="#tag-"]');

  for (let tag of tags){
    tag.addEventListener('click',tagClickHandler);
  }
}
addClickListenersToTags();

function generateAuthors(){
  let allAuthors = {};
  const articles = document.querySelectorAll(optArticleSelector);

  for (let article of articles){
    const authorList = article.querySelector(optArticleAuthorSelector);
    let html = '';
    const articleAuthor = article.getAttribute('data-author'),
      linkAuthorData = {author: articleAuthor},
      authorHTML = templates.articleAuthor(linkAuthorData);
    html = html + authorHTML;
    if(!allAuthors[articleAuthor]){
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
    authorList.innerHTML = html;
  }
  const authorList = document.querySelector('.authors'),
    authorsParams = calculateAuthorsParams(allAuthors);
  console.log('authorParams:', authorsParams);
  let allAuthorsHTML = {allAuthors: []};

  for (let author in allAuthors){
    allAuthorsHTML.allAuthors.push({
      author: author,
      count: allAuthors[author]
    });
    //old HTML code allAuthorsHTML += '<li><a href="#author-' + author + '">' + author + ' (' + (allAuthors[author]) + ')</a></li>';
  }
  authorList.innerHTML = templates.authorCloudLink(allAuthorsHTML);
}
generateAuthors();

function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this,
    href = clickedElement.getAttribute('href'),
    author = href.replace('#author-', ''),
    activeAuthors = document.querySelectorAll('a.active[href^="#author-"]');

  for (let activeAuthor of activeAuthors){
    activeAuthor.classList.remove('active');
  }
  const clickedAuthors = document.querySelectorAll('a[href="' + href + '"]');

  for (let clickedAuthor of clickedAuthors){
    clickedAuthor.classList.add('active');
  }
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors(){
  const authors = document.querySelectorAll('a[href^="#author-"]');

  for (let author of authors){
    author.addEventListener('click', authorClickHandler);
  }
}
addClickListenersToAuthors();