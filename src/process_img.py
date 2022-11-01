import numpy as np
import pandas as pd
from PIL import Image
import cv2
import extcolors
from colormap import rgb2hex

path_var  = "../resources/random-walk-images/"

def color_to_df(input):
    colors_pre_list = str(input).replace('([(','').split(', (')[0:-1]
    df_rgb = [i.split('), ')[0] + ')' for i in colors_pre_list]
    df_percent = [i.split('), ')[1].replace(')','') for i in colors_pre_list]
    
    #convert RGB to HEX code
    df_color_up = [rgb2hex(int(i.split(", ")[0].replace("(","")),
                          int(i.split(", ")[1]),
                          int(i.split(", ")[2].replace(")",""))) for i in df_rgb]
    
    df = pd.DataFrame(zip(df_color_up, df_percent), columns = ['c_code','occurence'])
    df = df.T
    return df

def exact_color(index, tolerance, zoom):
    colors_x = extcolors.extract_from_path(path_var+str(index)+".jpg", tolerance = tolerance, limit = 13)
    df_color = color_to_df(colors_x)
    print(df_color)
    df_color.to_csv('../data/'+str(index)+".csv")  
    return df_color


for i in range(77, 80):
    exact_color(i, 20, 1)