const axios = require('axios')

axios.interceptors.response.use(res => res.data)

async function fetchRepoList(){
    return axios.get('https://api.github.com/orgs/zhu-cli/repos');
}
async function fetchTagsList(repo){
    return axios.get(`https://api.github.com/repos/zhu-cli/${repo}/tags`);
}

module.exports = {
    fetchRepoList,
    fetchTagsList
}
