const reducer = (set: any, get: any) => {
    // manipulating for setting only the only unit state
    let SET = (setData: any) => {
      set((state: any) => ({ ...state, ...setData }))
    }
  
    // return the unit state and action.
    return {
      allCourses: [],
      allPartners: [],
      categories: [],
      user: null,
      notify: { open: false, message: '', type: '' },
      showNotify: true,
      showNotifyStopRecording: true,
      showProtectedWall: true,
  
      setCategories: (cat: any) => {
        SET({ categories: cat })
      },
      setPartners: (part: any) => {
        SET({ allPartners: part })
      },
  
      setCourses: (cour: any) => {
        SET({ allCourses: cour })
      },
      setUser: (user: any) => {
        SET({ user: user })
      },
      setNotify: (notify: Object) => {
        SET({ notify })
      },
      setToolTip: (showNotify: boolean) => {
        SET({ showNotify: showNotify })
      },
      setToolTipStopRecording: (showNotifyStopRecording: boolean) => {
        SET({ showNotifyStopRecording: showNotifyStopRecording })
      },
      updatePrtectedWall: (protectedWall: boolean) => {
        SET({ showProtectedWall: protectedWall })
      },
    }
  }
  
  export default reducer
  