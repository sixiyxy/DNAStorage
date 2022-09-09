import plotly.io as pio
import matplotlib.pyplot as plt
from Model.Model import *
import plotly.express as px
from Analysis.Analysis import dna_chunk, plot_oligo_number_distribution, plot_error_distribution, save_simu_result
from Analysis.Fountain_analyzer import FT_Analyzer_Simplified
from Encode.DNAFountain import *
pio.templates.default = "plotly_white"
import Model.config as config


