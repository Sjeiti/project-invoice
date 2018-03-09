import projectSort from '../../../../src/util/projectSort'

describe('projectSort',()=>{

  it('should sort by date',()=>{
    const projects = [
      { id:'a', date: new Date('12-04-1977') }
      ,{ id:'c', date: new Date('12-04-1975') }
      ,{ id:'b', date: new Date('12-04-1976') }
    ]
    projects.sort(projectSort)
    assert.equal(projects.map(p=>p.id).join(','),'c,b,a')
  })
  it('should sort by id when date is same',()=>{
    const projects = [
      { id:'a', date: new Date('12-04-1976') }
      ,{ id:'c', date: new Date('12-04-1976') }
      ,{ id:'b', date: new Date('12-04-1976') }
    ]
    projects.sort(projectSort)
    assert.equal(projects.map(p=>p.id).join(','),'a,b,c')
  })

})
