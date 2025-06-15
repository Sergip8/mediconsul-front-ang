export class SelectData{
    placeholder: string = 'search'
    list: SelectValues[] = []
}
export interface SelectValues{
    id: number
    name: string
    type: string
}
