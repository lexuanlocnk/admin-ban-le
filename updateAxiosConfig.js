const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Tạo readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

(async () => {
  try {
    console.log('--- 🛠️ Cập nhật axiosConfig.js ---');

    const newBaseURL = await askQuestion('👉 Nhập baseURL mới: ');
    const newImageBaseUrl = await askQuestion('👉 Nhập imageBaseUrl mới: ');
    const newMainUrl = await askQuestion('👉 Nhập mainUrl mới: ');

    const filePath = path.join(__dirname, 'src', 'axiosConfig.js');

    let content = fs.readFileSync(filePath, 'utf-8');

    content = content.replace(/baseURL:\s*['"`](.*?)['"`],/, `baseURL: '${newBaseURL}',`);
    content = content.replace(/const imageBaseUrl = ['"`](.*?)['"`]/, `const imageBaseUrl = '${newImageBaseUrl}'`);
    content = content.replace(/const mainUrl = ['"`](.*?)['"`]/, `const mainUrl = '${newMainUrl}'`);

    fs.writeFileSync(filePath, content, 'utf-8');

    console.log('\n✅ Cập nhật axiosConfig.js thành công!');
  } catch (error) {
    console.error('❌ Có lỗi khi cập nhật:', error);
  } finally {
    rl.close();
  }
})();
