var cache = { }
  , minute = 1000 * 60;

function createNew(key) {
  cache[key] = { expires: 0, value: undefined };
}

function expired(key) {
  return !cache[key] || cache[key].expires < new Date();
}

function put(key, value, expiryTimeInMinutes) { 
  if (!cache[key]) createNew(key);
  
  cache[key].value = value;
  cache[key].expires = new Date() + expiryTimeInMinutes * minute;
}

function get(key) {
  return !expired(key) ? cache[key] : undefined;
}

[ 'github.repos' ].forEach(createNew);

module.exports = {
    expired: expired
  , put: put
  , get: get
};
