/**
 * @file positive_integer.js
 * @brief Regla de validación: Número entero estrictamente positivo (> 0), escrito solo con dígitos.
 * @project Bibliotech
 * @author Bautista Romanazzi
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 * @note A diferencia de PositiveNumber, rechaza "2.5" o "1e1": con el sql_mode no estricto
 * de la base, MySQL los convertiría en silencio a otro entero (ej: "2.5" → 3) en lugar de fallar.
 */

 class PositiveInteger
 {
    constructor(messageName = "CT_POSITIVE_NUMBER")
    {
        this._messageName = messageName;
        this.validator = null;
    }

    evaluate(target)
    {
        return /^[1-9]\d*$/.test(String(target).trim());
    }

    validate(target)
    {
        if (!this.evaluate(target))
        {
            const message = this.validator.i18n.getMessage(this._messageName);
            throw new Error(message);
        }
    }
}
module.exports = PositiveInteger;