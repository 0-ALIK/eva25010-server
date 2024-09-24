export function typeValidator(type: any) {
    return (value: any) => {
        const primitiveTypes = ['string', 'number', 'boolean', 'undefined', 'symbol', 'bigint', 'function'];
        
        if (primitiveTypes.includes(type)) {
            if (typeof value !== type) {
                throw new Error(`El valor debe ser de tipo ${type}`);
            }

        } else if (value instanceof type) {
            return true;
        } else {
            throw new Error(`El valor no es una instancia de ${type.name || type}`);
        }

        return true;
    };
}