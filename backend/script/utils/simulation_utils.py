from .simulation_arg import synthMeth 


class ArgumentPasser:
    """Simple Class for passing arguments in arg object.
        Init all arttributes from a dictionary.
    """
    def __init__(self, dic):
        self.__dict__.update(dic)

def SynthMeth_arg(synthesis_method):
    dic=synthMeth[synthesis_method]
    return ArgumentPasser(dic)

