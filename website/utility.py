def has_updated_fields(db_entry, new_name: str, new_desc: str, point: bool) -> bool:
    db_entry_name = db_entry.name
    db_entry_desc = db_entry.description
    db_entry_starting_point = db_entry.is_starting_point
    if db_entry_name != new_name or db_entry_desc != new_desc or db_entry_starting_point != point:
        return True
    return False


def get_lat_lng_deleted_marker(marker):
    return map(lambda x: float(x), marker.split('-'))
