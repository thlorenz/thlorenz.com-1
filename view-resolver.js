function resolve(name, model) {
  model = model || require('./models/' + name).def();
}

