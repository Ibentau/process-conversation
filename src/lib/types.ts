export type EventData = {
    event: string
    timestamp: number
    metadata: {
        model_id: string
    }
    text: string
    parse_data: {
        intent: {
            name: string
            confidence: number
        }
        entities: Array<{
            entity: string
            start: number
            end: number
            confidence_entity: number
            value: string
            extractor: string
        }>
        text: string
        message_id: string
        metadata: {}
        text_tokens: Array<Array<number>>
        intent_ranking: Array<{
            name: string
            confidence: number
        }>
        response_selector: {
            all_retrieval_intents: Array<any>
            default: {
                response: {
                    responses: any
                    confidence: number
                    intent_response_key: any
                    utter_action: string
                }
                ranking: Array<any>
            }
        }
    }
    input_channel: string
    message_id: string
}
