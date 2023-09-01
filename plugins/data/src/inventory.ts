export type CountModel = {
    date: string
    count: number
}

export type ServerModel = {
    id: string
    name: string
    operatingSystem: string
    tags: string[]
    cpu: string
}

export type KafkaModel = {
    id: string
    name: string
    zookeeperNodes: string
    brokers: string
    version: string
    adminUrl: string
    adminUser: string
    adminPassword: string
}

export type KafkaTopicModel = {
    name: string
}

export type ResourceModel = {
    id: string
    name: string
    desccription: string
    tags: string[]
    type: string
    system: string
    dependsOn: string[]
}

export type ComponentModel = {
    id: string
    name: string
    namespace: string
    desccription: string
    type: string
    language: string
    tags: string[]
    owner: string
    system: string
    dependsOn: string[]
}