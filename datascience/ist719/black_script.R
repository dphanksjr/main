
library(maps) 
 library(maptools)
library(mapproj) 


setwd('D:/Documents/IST719/final_project/data')
eq <-read.csv('last_50y.csv', header=TRUE)
catalog <- read.csv("last_50y.csv", stringsAsFactors = FALSE)
(catalog$time),FUN = function(x) {return(as.integer(strsplit(x,"-")[[1]][1]))})
world.map <- map_data("world")
 catalog <-catalog[order(catalog$mag),]
 EQ_min_year<-1966
 mycatalog<-catalog[which(catalog$year>EQ_min_year),]

ggplot()+
  geom_polygon(data = world.map, aes(x = long, y = lat, group = group),fill = "white",alpha=0.2)+
  theme_classic()+
  theme(axis.line = element_blank(), axis.text = element_blank(),axis.ticks = element_blank(),plot.margin=unit(c(3, 0, 0, 0),"mm"),legend.text = element_text(size = 6),legend.title = element_text(size = 8, face = "plain"),panel.background = element_rect(fill='black'))+ #sets the theme. Background color is black so the world map now appears (white on the black background).
  geom_point(aes(x=longitude,y=latitude,size=mag, color=mag),data=mycatalog)+ #Adds the earthquake points, with the size and color according to "mag" variable (magnitude).
  coord_fixed(ylim = c(-82.5, 87.5), xlim = c(-185, 185))+
  scale_size_continuous(range = c(0.25, 2))+ #size gradient for points
  scale_color_continuous(low="yellow",high="red")+ #color gradient for points
  theme(legend.position="none",axis.title.y=element_blank(),axis.title.x=element_blank())+
  geom_text(aes(x=35,y=-75),label=paste("Earthquakes recorded since ",EQ_min_year),color="white",hjust=0,size=3.5)