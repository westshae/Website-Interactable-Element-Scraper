//https://moz.com/top500 for data
function extractLinks() {
    const links = document.querySelectorAll('a');
    
    const extractedLinks = [];
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.trim() !== '' && href.at(0) != "/" && !href.includes("moz") && !href.includes("#")) {
            extractedLinks.push(href);
        }
    });
    
    return extractedLinks;
}

const allLinks = extractLinks();

console.log(allLinks);
