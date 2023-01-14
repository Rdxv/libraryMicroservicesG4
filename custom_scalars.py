from ariadne import ScalarType

from uuid import UUID
from datetime import date


## Date type
date_scalar = ScalarType('Date')

@date_scalar.serializer
def serialize_date(value):
    return value.isoformat()

@date_scalar.value_parser
def parse_date(value):
    try:
        return date.fromisoformat(str(value))
    except (ValueError, TypeError):
        raise ValueError(f'"{value}" is not a valid ISO 8601 date')


## Year type
year_scalar = ScalarType('Year')

@year_scalar.serializer
def serialize_year(value):
    return str(value)

@year_scalar.value_parser
def parse_year(value):
    try:
        year = int(value)
        if (year >= 0 and year <= 9999):
            return year # If this return is not executed the code below will raise a value exception
    except (ValueError, TypeError):
        pass # In case of value or type errors, ignore them and raise our custom exception (other exceptions are not ignored)
    raise ValueError(f'"{value}" is not a valid ISO 8601 year')



## UUIDV1 type
uuidv1_scalar = ScalarType('UUIDV1')

@uuidv1_scalar.serializer
def serialize_uuidv1(value):
    return str(value)

@uuidv1_scalar.value_parser
def parse_uuidv1(value):
    try:
        myuuid = UUID(str(value))
        if myuuid.version == 1:
            return myuuid
    except (ValueError, TypeError):
        pass
    raise ValueError(f'"{value}" is not a valid UUIDV1')


## List of custom scalars for import
custom_scalars = [date_scalar, year_scalar, uuidv1_scalar]
