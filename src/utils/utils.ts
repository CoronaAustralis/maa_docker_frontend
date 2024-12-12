function debounce(func: Function, time = 300) {
  let timeout:number|null;
  return function(this:any,...args:any[]) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, time);
  };
  }

  function generateHash(e:number=16):Promise<string> {    
    if(!Number.isInteger(e)){
      return Promise.reject("")
    }
    let t = "abcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
    for (let i:number = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return Promise.resolve(n)
}

export { debounce,generateHash };