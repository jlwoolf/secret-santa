declare module 'secret-santa-generator' {
    export default {
        buildSecretSantaTable<T>(arr: T[]): Record<T, T>
    }
}