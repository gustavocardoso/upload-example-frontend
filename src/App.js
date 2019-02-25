import React, { Component } from 'react';
import { uniqueId } from 'lodash'
import filesize from 'filesize'

import GlobalStyle from './styles/global'
import { Container, Content } from './styles'
import Upload from './components/Upload'
import FileList from './components/FileList'

import api from './services/api'

class App extends Component {
  state = {
    uploadedFiles: []
  }

  handleUpload = files => {
    const uploadedFiles = files.map(file => (
      {
        file,
        id: uniqueId(),
        name: file.name,
        readableSize: filesize(file.size),
        preview: URL.createObjectURL(file),
        progress: 0,
        uploaded: false,
        error: false,
        url: null
      }
    ))

    this.setState({
      uploadedFiles: this.state.uploadedFiles.concat(uploadedFiles)
    })

    uploadedFiles.forEach(this.processUpload)
  }

  processUpload = (uploadedFile) => {
    const data = new FormData()
    data.append('file', uploadedFile.file, uploadedFile.name)
    
    api.post('/posts', data, {
      onUploadProgress: event => {
        const progress = parseInt(Math.round((event.loaded * 100) / event.total))
        
        this.updateFile(uploadedFile.id, { progress })
      }
    })
    .then(response => {
      this.updateFile(uploadedFile.id, {
        uploaded: true,
        id: response.data._id,
        url: response.data.url
      })
    })
    .catch(() => {
      this.updateFile(uploadedFile.id, {
        error: true
      })
    })
  }

  updateFile = (id, data) => {
    this.setState({ uploadedFiles: this.state.uploadedFiles.map(uploadedFile => {
      return id === uploadedFile.id
        ? { ...uploadedFile, ...data }
        : uploadedFile;
    }) })
  }

  handleDelete = async id => {
    await api.delete(`/posts/${id}`)

    this.setState({
      uploadedFiles: this.state.uploadedFiles.filter(file => file.id !== id)
    })
  }

  async componentDidMount () {
    const response = await api.get('posts')

    this.setState({
      uploadedFiles: response.data.map(file => (
        {
          id: file._id,
          name: file.name,
          readableSize: filesize(file.size),
          preview: file.url,
          uploaded: true,
          url: file.url
        }
      ))
    })
  }

  componentWillUnmount () {
    this.state.uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview))
  }

  render() {
    const { uploadedFiles } = this.state

    return (
      <Container>
        < GlobalStyle />
        <Content>
          <Upload onUpload={this.handleUpload} />
          {!!uploadedFiles.length && (
            <FileList files={uploadedFiles} onDelete={this.handleDelete} />
          )}
        </Content>
      </Container>
    );
  }
}

export default App;
