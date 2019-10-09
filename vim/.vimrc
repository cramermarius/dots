"Vim configuration file -- Marius Cramer (marcramer@protonmail.com)
"vim-plug autoload
if empty(glob('~/.vim/autoload/plug.vim'))
  silent !curl -fLo ~/.vim/autoload/plug.vim --create-dirs
    \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  autocmd VimEnter * PlugInstall --sync | source $MYVIMRC
endif

"Vim-Plug configuration–––––––––––––––––––––––––––––––––––––––––––––––––––––––––
call plug#begin('~/vim/plugged')
	Plug 'lervag/vimtex'
    	let g:tex_flavor = 'latex'
	    let g:vimtex_view_method = 'zathura'
	    let g:vimtex_quickfix_mode = 0
	    set conceallevel=0
	    let g:tex_conceal = 'abdmg'
	Plug 'sirver/ultisnips'
	    let g:UltiSnipsExpandTrigger = '<tab>'
	    let g:UltiSnipsJumpForwardTrigger = '<tab>'
	    let g:UltiSnipsJumpBackwardTrigger = '<s-tab>'
	Plug 'vim-airline/vim-airline'
		let g:airline_powerline_fonts = 1
		if !exists('g:airline_symbols')
		    let g:airline_symbols = {}
		endif
		let g:airline_left_sep = ''
		let g:airline_left_alt_sep = ''
		let g:airline_right_sep = ''
		let g:airline_right_alt_sep = ''
		let g:airline_symbols.readonly = ''
	Plug 'vim-airline/vim-airline-themes'
	    let g:airline_theme = 'deus'
	Plug 'arcticicestudio/nord-vim'
	Plug 'junegunn/goyo.vim'
		let g:goyo_width = 105
	    let g:goyo_height = 40
	Plug 'junegunn/limelight.vim'
	Plug 'airblade/vim-gitgutter'
	Plug 'scrooloose/nerdtree'
		let NERDTreeShowHidden = 0
		let NERDTreeQuitOnOpen = 1
		let NERDTreeMinimalUI = 1
		let NERDTreeDirArrows = 1
	Plug 'iamcco/markdown-preview.nvim', {'do':{->mkdp#util#install()}}
		let g:mkdp_browser = 'firefox'
		let g:mkdp_preview_options = {
	    \ 'disable_sync_scroll': 0,
	    \ 'sync_scroll_type': 'relative',
	    \ }
	Plug 'Xuyuanp/nerdtree-git-plugin'
	Plug 'ryanoasis/vim-devicons'
call plug#end()
"––––––––––––––––––––––––––––––––––––––––––––––––––––––––-––––––––––––––––––––––


"vim settings–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
set laststatus=2
set tabstop=4
set showmatch
set termguicolors
set noshowmode
set tw=90
set smartcase
set ignorecase
set hlsearch
set cursorline
set foldmethod=syntax
set foldnestmax=10
set foldlevel=2
set relativenumber
set number
set encoding=UTF-8
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


" Theme–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
colorscheme nord
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


" Folding behaviour–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
augroup remember_folds
    autocmd!
    autocmd BufWinLeave ?* mkview | filetype detect
    autocmd BufWinEnter ?* silent loadview | filetype detect
augroup END
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


" NERDTree––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
" open NERDTree on default
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 0 && !exists("s:std_in") | NERDTree | endif
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


"Goyo functions–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
function! s:goyo_enter()
	set number
	set relativenumber
	set showmode
	set noshowcmd
	Limelight
endfunction

function! s:goyo_leave()
	set number
	set relativenumber
	Limelight!
endfunction

autocmd! User GoyoEnter nested call <SID>goyo_enter()
autocmd! User GoyoLeave nested call <SID>goyo_leave()
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––


"Mappings–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
noremap <C-y> :tabn<CR>
noremap <C-o> :Goyo<CR>
noremap <C-x> :NERDTreeToggle<CR>
nnoremap <C-i> :set hlsearch!<CR>
inoremap <C-l> <c-g>u<Esc>[s1z=`]a<c-g>u
inoremap <C-f> <Esc>: silent exec '.!inkscape-figures create "'.getline('.').'" "'.b:vimtex.root.'/figures/"'<CR><CR>:w<CR>
nnoremap <C-f> : silent exec '!inkscape-figures edit "'.b:vimtex.root.'/figures/" > /dev/null 2>&1 &'<CR><CR>:redraw!<CR>
nnoremap <C-p> <Plug>MarkdownPreviewToggle
"–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
