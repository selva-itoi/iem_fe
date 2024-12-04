// const ftp = require('basic-ftp');

// const localPath = './dist';
// const htAccess = './.htaccess';
// const remotePath = '/public_html/dev';
// const skipDir = ['adminSponsor', 'api']
// const skipFiles = []

// async function deploy() {
//     const client = new ftp.Client();
//     try {
//         await client.access({
//         });

//         console.log('Deploy Running ...')
//         await client.ensureDir(remotePath);
//         const list = await client.list();
//         for (const l of list) {
//             if (l.isFile) {
//                 if (!skipFiles.includes(l.name)) {
//                     await client.remove(l.name);
//                 }
//             } else if (l.isDirectory) {
//                 if (!skipDir.includes(l.name)) {
//                     await client.removeDir(l.name);
//                 }
//             }
//         }

//         await client.uploadFrom(htAccess, `${remotePath}/.htaccess`);
//         await client.uploadFromDir(localPath, remotePath);
//         console.log('Deployment completed.');
//     } catch (err) {
//         console.error('Error deploying:', err);
//     } finally {
//         client.close();
//     }
// }

// deploy();
