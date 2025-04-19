document.getElementById('scouting-form').addEventListener('submit', function(e){
    e.preventDefault();
    const formData = new formData(e.target);
    const entry = Object.fromEntries(FormData.entries())

    //store locally
    let data = JSON.parse(this.localStorage.getItem('scoutingData')) || [];
    data.push(entry);
    localStorage.setItem('scoutingData', JSON.stringify(data));

    alert('Data saved!');
    e.target.reset();

});

function downlodCSV() {
    const data = JSON.parse(localStorage.getItem('scoutingData')) || [];
  if (data.length === 0) return alert('No data to export.');

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (let row of data) {
    csvRows.push(headers.map(header => row[header]).join(','));
  }

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'scouting_data.csv';
  a.click();
}