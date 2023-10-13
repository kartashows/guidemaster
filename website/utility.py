def has_updated_fields(db_entry, new_name, new_desc):
    db_entry_name = db_entry.name
    db_entry_desc = db_entry.description
    if db_entry_name != new_name or db_entry_desc != new_desc:
        return True
    return False


def get_lat_lng_deleted_marker(marker):
    return map(lambda x: float(x), marker.split('-'))
