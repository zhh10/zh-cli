const path = require('path')
const Inquirer = require('inquirer')
const util = require('util')
const downloadGitRepo = require('download-git-repo')
const {fetchRepoList,fetchTagsList} = require('./request')
const {wrapLoading} = require('./util')
const ora = require('ora')
class Creator {
    constructor(projectName,targetDir){
        this.name = projectName 
        this.target = targetDir
        this.downloadGitRepo = util.promisify(downloadGitRepo)
        // 此时就支持promise了
    }
    async fetchRepo(){
        // 失败了重新获取
        let repos = await wrapLoading(fetchRepoList,'waiting fetch template')
        if(!repos) return ;
        repos = repos.map(item => item.name)
        let {repo} = await Inquirer.prompt({
            name:'repo',
            type:'list',
            choices:repos,
            message:'please choose a template to create project'
        })
        return repo
    }
    async fetchTag(repo){
        let tags = await wrapLoading(fetchTagsList,'waiting fetch tag',repo)
        if(!tags) return ;
        tags = tags.map(item => item.name)
        let {tag} = await Inquirer.prompt({
            name:'tag',
            type:'list',
            choices:tags,
            message:'please choose a tag to create project'
        })
        return tag
    }
    async download(repo,tag){
        let requestUrl = `zhu-cli/${repo}${tag?'#'+tag:''}`
        const spinner = ora('template is downloading...')
        spinner.start()
        await this.downloadGitRepo(requestUrl,this.target)
        spinner.succeed()
        return this.target
    }
    async create(){
        // 1 先去拉取当前组织下的模版
        let repo =  await this.fetchRepo()
        // 2 再通过模版找到版本号 
        let tag = await this.fetchTag(repo)
        // 3. 下载
       await this.download(repo,tag)
    }
}

module.exports = Creator
