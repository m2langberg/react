

export interface StakeHolder {
    state: string
    user: {
        id: number
        name: string
        email: string
    }
}

export interface Project {
    id?: number
    name: string
    path: string
    parent: number | null
    parentProj?: Project 
    children: Project[]
    owners: StakeHolder[]
}



