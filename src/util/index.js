export function watchAll(vm,...props){
	return Promise.all(props.map(key=>new Promise(resolve=>{
         const unwatch = vm.$watch(key,()=>{
           unwatch()
           resolve()
           return vm[key]
         })
       })
     ))
}