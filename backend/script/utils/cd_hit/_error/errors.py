class CdhitCommandError(Exception):
    """cdhit command failed."""
    pass

class LengthMissmatchError(Exception):
    """sequence and header list does not have same length"""
    def __init__(self, msg):
        self.msg = msg

class InvalidFileTypeError(Exception):
    def __init__(self, msg):
        self.msg = msg

class FileParsingError(Exception):
    def __init__(self, msg):
        self.msg = msg

class MissingArgumentError(Exception):
    def __init__(self, msg):
        self.msg = msg

class InvalidFilePath(Exception):
    def __init__(self, msg):
        self.msg = msg