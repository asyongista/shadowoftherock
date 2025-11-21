document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') search();
});


async function search() {
    const verse = document.getElementById('searchInput').value.trim();
    const resultDiv = document.getElementById('result');


    if (!verse) {
        resultDiv.textContent = 'Please enter a verse.';
        return;
    }


    const result = await window.api.searchVerse(verse);
    resultDiv.textContent = result;
}